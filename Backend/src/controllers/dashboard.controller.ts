// controllers/dashboard.controller.ts
import type { Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { prisma } from "../config/db.js"
import type { AuthRequest } from "../middlewares/auth.middleware.js"
import { STATUS_MESSAGE } from "../constant/systemMessage.js"
import { getAttendanceStatsData } from "../services/attendance.service.js"
import { getTaskStatsData } from "../services/task.service.js"
import { getRequestStatsData } from "../services/request.service.js"

export class DashboardController {
  public getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const currentUserId = req.userId!
      const targetUserId = req.query.userId as string | undefined

      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { role: true, managedDepartment: { select: { id: true } } }
      })

      if (!currentUser) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy người dùng" })
      }

      let resolvedUserId = currentUserId

      if (targetUserId && targetUserId !== currentUserId) {
        if (currentUser.role === "EMPLOYEE") {
          return res.status(StatusCodes.FORBIDDEN).json({ message: "Bạn không có quyền xem dữ liệu của người khác" })
        }

        if (currentUser.role === "MANAGER") {
          const targetUser = await prisma.user.findUnique({ where: { id: targetUserId }, select: { departmentId: true } })
          if (!targetUser || targetUser.departmentId !== currentUser.managedDepartment?.id) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Nhân viên này không thuộc phòng ban bạn quản lý" })
          }
        }

        resolvedUserId = targetUserId
      }

      const [attendance, task, request] = await Promise.all([
        getAttendanceStatsData(resolvedUserId),
        getTaskStatsData(resolvedUserId),
        getRequestStatsData(resolvedUserId)
      ])

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: { attendance, task, request }
      })
    } catch (error) {
      next(error)
    }
  }

  public getFilterableEmployees = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const currentUserId = req.userId!
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { role: true, managedDepartment: { select: { id: true } } }
      })

      if (!currentUser || currentUser.role === "EMPLOYEE") {
        return res.status(StatusCodes.FORBIDDEN).json({ message: "Không có quyền truy cập" })
      }

      const whereCondition = currentUser.role === "ADMIN" ? {} : { departmentId: currentUser.managedDepartment?.id }

      const employees = await prisma.user.findMany({
        where: whereCondition,
        select: { id: true, fullName: true, department: { select: { title: true } } },
        orderBy: { fullName: "asc" }
      })

      return res.status(StatusCodes.OK).json({ message: STATUS_MESSAGE.STATUS_OK, data: employees })
    } catch (error) {
      next(error)
    }
  }
}
