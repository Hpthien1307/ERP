import type { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { prisma } from "../config/db.js"
import { AttendanceValidation } from "../validations/attendance.validation.js"
import { STATUS_MESSAGE } from "../constant/systemMessage.js"
import type { AuthRequest } from "../middlewares/auth.middleware.js"
import { getAttendanceStatsData } from "../services/attendance.service.js"
import { calculateFinalStatus, getCheckInStatus } from "../utils/attendanceCalc.util.js"

// Hàm tiện ích: Lấy mốc bắt đầu (00:00:00) và kết thúc (23:59:59.999) của ngày hiện tại
const getDayRange = (dateInput = new Date()) => {
  const startOfDay = new Date(dateInput)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(dateInput)
  endOfDay.setHours(23, 59, 59, 999)

  return { startOfDay, endOfDay }
}

export class AttendanceController {
  // CHECK-IN
  public checkIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId

      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Không xác định được danh tính người dùng"
        })
      }

      const { startOfDay, endOfDay } = getDayRange()

      // Kiểm tra xem hôm nay user đã check-in chưa
      const existingAttendance = await prisma.attendance.findFirst({
        where: {
          userId,
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true
            }
          }
        }
      })

      if (existingAttendance) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Hôm nay bạn đã thực hiện check-in rồi"
        })
      }

      const now = new Date()
      const status = getCheckInStatus(now)
      const newAttendance = await prisma.attendance.create({
        data: {
          userId,
          date: now,
          checkIn: now,
          status: status
        }
      })

      return res.status(StatusCodes.CREATED).json({
        message: status === "LATE" ? "Check-in thành công (Đi trễ)" : "Check-in thành công",
        data: newAttendance
      })
    } catch (error) {
      next(error)
    }
  }

  // CHECK-OUT
  public checkOut = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId
      const { startOfDay, endOfDay } = getDayRange()

      const existingAttendance = await prisma.attendance.findFirst({
        where: {
          userId,
          date: { gte: startOfDay, lte: endOfDay }
        }
      })

      if (!existingAttendance || !existingAttendance.checkIn) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Bạn chưa thực hiện check-in hôm nay"
        })
      }

      const checkOutTime = new Date()
      const diffMs = checkOutTime.getTime() - existingAttendance.checkIn.getTime()
      const rawHours = diffMs / (1000 * 60 * 60)
      const workingHours = Math.round(rawHours * 100) / 100

      // 💡 TÍNH LẠI TRẠNG THÁI CUỐI CÙNG DỰA TRÊN CHECK-IN VÀ TỔNG GIỜ LÀM
      const finalStatus = calculateFinalStatus(existingAttendance.checkIn, workingHours)

      const updatedAttendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          checkOut: checkOutTime,
          workingHours,
          status: finalStatus // 🟢 Cập nhật đúng status (ví dụ: UNDERTIME / Thiếu giờ)
        }
      })

      return res.status(StatusCodes.OK).json({
        message: `Check-out thành công. Bạn đã làm việc ${workingHours} giờ hôm nay!`,
        data: updatedAttendance
      })
    } catch (error) {
      next(error)
    }
  }
  // LẤY TRẠNG THÁI CHẤM CÔNG HÔM NAY
  public getTodayStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId

      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Không xác định được danh tính người dùng"
        })
      }

      const { startOfDay, endOfDay } = getDayRange()

      // Tìm bản ghi chấm công của hôm nay (nếu có)
      const todayAttendance = await prisma.attendance.findFirst({
        where: {
          userId,
          date: { gte: startOfDay, lte: endOfDay }
        }
      })

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: todayAttendance
      })
    } catch (error) {
      next(error)
    }
  }

  // XEM LỊCH SỬ CHẤM CÔNG CÁ NHÂN
  public getMyAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Yêu cầu đăng nhập" })
      }

      const queryValidation = AttendanceValidation.getHistory.safeParse(req.query)
      if (!queryValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: queryValidation.error.flatten().fieldErrors
        })
      }

      const { month, year, page, limit, filterType } = queryValidation.data
      const skip = (page - 1) * limit

      const whereCondition: any = { userId }

      if (month && year) {
        const startOfMonth = new Date(year, month - 1, 1)
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999)
        whereCondition.date = { gte: startOfMonth, lte: endOfMonth }
      }

      if (filterType === "LATE") {
        whereCondition.status = "LATE"
      } else if (filterType === "ON_TIME") {
        whereCondition.status = "ON_TIME"
      } else if (filterType === "ABSENT") {
        whereCondition.status = "ABSENT"
      } else if (filterType === "LEAVE") {
        whereCondition.status = "LEAVE"
      }

      const [attendances, total] = await Promise.all([
        prisma.attendance.findMany({
          where: whereCondition,
          orderBy: { date: "desc" },
          skip,
          take: limit
        }),
        prisma.attendance.count({ where: whereCondition })
      ])

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: attendances,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      })
    } catch (error) {
      next(error)
    }
  }

  // XEM THỐNG KÊ CHẤM CÔNG CÁ NHÂN
  public getMyAttendanceStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await getAttendanceStatsData(req.userId!)
      return res.status(StatusCodes.OK).json({ message: STATUS_MESSAGE.STATUS_OK, data })
    } catch (error) {
      next(error)
    }
  }

  // ADMIN/MANAGER XEM TẤT CẢ CHẤM CÔNG
  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryValidation = AttendanceValidation.getHistory.safeParse(req.query)
      if (!queryValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: queryValidation.error.flatten().fieldErrors
        })
      }

      const { month, year, userId, departmentId } = queryValidation.data
      const whereCondition: any = {}

      if (userId) whereCondition.userId = userId

      // Lọc theo phòng ban thông qua quan hệ của user
      if (departmentId) {
        whereCondition.user = {
          departmentId
        }
      }

      if (month && year) {
        const startOfMonth = new Date(year, month - 1, 1)
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999)
        whereCondition.date = {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }

      const records = await prisma.attendance.findMany({
        where: whereCondition,
        orderBy: { date: "desc" },
        include: {
          user: {
            select: {
              id: true,
              fullName: true
            }
          }
        }
      })

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: records
      })
    } catch (error) {
      next(error)
    }
  }
}
