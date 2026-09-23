import type { Request, Response, NextFunction } from "express"
import { STATUS_MESSAGE } from "../constant/systemMessage.js"
import { prisma } from "../config/db.js"
import { StatusCodes } from "http-status-codes"
import { RequestValidation } from "../validations/request.validation.js"
import type { AuthRequest } from "../middlewares/auth.middleware.js"
import { createNotification, NotificationType } from "../services/notification.service.js"
import { getPaginationParams, buildPaginationResponse } from "../utils/pagination.util.js"
import { getRequestStatsData } from "../services/request.service.js"

export class RequestController {
  public getRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, skip } = getPaginationParams(req)
      const [data, total] = await Promise.all([
        prisma.request.findMany({
          orderBy: {
            createdAt: "desc"
          },
          skip,
          take: limit,
          omit: {
            reviewedBy: true
          },
          include: {
            reviewer: {
              select: {
                id: true,
                fullName: true
              }
            },
            user: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        }),
        prisma.request.count()
      ])

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data,
        pagination: buildPaginationResponse(page, limit, total)
      })
    } catch (error) {
      next(error)
    }
  }

  public getRequestStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await getRequestStatsData(req.userId!)
      return res.status(StatusCodes.OK).json({ message: STATUS_MESSAGE.STATUS_OK, data })
    } catch (error) {
      next(error)
    }
  }
  public getManagedRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const currentUserId = req.userId!
      const queryValidation = RequestValidation.getPaginatedRequest.safeParse(req.query)
      if (!queryValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: queryValidation.error.flatten().fieldErrors
        })
      }

      const { page, limit, search, type, status } = queryValidation.data
      const skip = (page - 1) * limit

      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: {
          role: true,
          managedDepartment: {
            select: { id: true }
          }
        }
      })

      if (!currentUser) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy người dùng"
        })
      }

      const whereCondition = {
        status: status ?? "PENDING", // mặc định PENDING nếu không truyền status khác
        ...(type && { type }),
        ...(search && { reason: { contains: search, mode: "insensitive" as const } }),
        ...(currentUser.role !== "ADMIN" && {
          user: { departmentId: currentUser.managedDepartment?.id ?? "__NO_DEPARTMENT__" }
        })
      }

      const [data, total] = await Promise.all([
        await prisma.request.findMany({
          where: whereCondition,
          orderBy: {
            createdAt: "desc"
          },
          skip,
          take: limit,
          omit: {
            reviewedBy: true
          },
          include: {
            reviewer: {
              select: {
                id: true,
                fullName: true
              }
            },
            user: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        }),
        prisma.request.count({ where: whereCondition })
      ])

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data,
        pagination: buildPaginationResponse(page, limit, total)
      })
    } catch (error) {
      next(error)
    }
  }

  public getUserRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const queryValidation = RequestValidation.getPaginatedRequest.safeParse(req.query)
      if (!queryValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: queryValidation.error.flatten().fieldErrors
        })
      }

      const { page, limit, search, type, status } = queryValidation.data
      const skip = (page - 1) * limit

      const whereCondition = {
        userId: req.userId,
        ...(type && { type }),
        ...(status && { status }),
        ...(search && { reason: { contains: search, mode: "insensitive" as const } })
      }

      const [data, total] = await Promise.all([
        prisma.request.findMany({
          where: whereCondition,
          include: {
            reviewer: { select: { fullName: true } },
            user: { select: { fullName: true } }
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit
        }),
        prisma.request.count({ where: whereCondition })
      ])

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      })
    } catch (error) {
      next(error)
    }
  }

  public createRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const bodyValidation = RequestValidation.createRequest.safeParse(req.body)
      if (!bodyValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: bodyValidation.error.flatten().fieldErrors
        })
      }

      const existingRequest = await prisma.request.findFirst({
        where: {
          userId: req.userId,
          type: bodyValidation.data.type,
          startDate: bodyValidation.data.startDate,
          endDate: bodyValidation.data.endDate,
          reason: bodyValidation.data.reason
        },
        include: {
          reviewer: {
            select: {
              fullName: true
            }
          }
        }
      })

      if (existingRequest) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Bạn đã có đơn yêu cầu với trạng thái tương tự"
        })
      }

      const newRequest = await prisma.request.create({
        data: {
          userId: req.userId!,
          ...bodyValidation.data
        },
        include: {
          user: {
            select: {
              fullName: true,
              department: {
                select: {
                  managerId: true
                }
              }
            }
          }
        }
      })

      const managerId = newRequest.user.department?.managerId
      if (managerId) {
        await createNotification({
          userId: managerId,
          type: NotificationType.NEW_REQUEST,
          title: "Đơn yêu cầu mới",
          message: `${newRequest.user.fullName} vừa gửi đơn ${newRequest.type}`,
          requestId: newRequest.id
        })
      }

      return res.status(StatusCodes.CREATED).json({
        message: STATUS_MESSAGE.STATUS_CREATE,
        data: newRequest
      })
    } catch (error) {
      next(error)
    }
  }

  public reviewRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const idValidation = RequestValidation.getRequestId.safeParse(req.params)
      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }

      const bodyValidation = RequestValidation.reviewRequest.safeParse(req.body)
      if (!bodyValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: bodyValidation.error.flatten().fieldErrors
        })
      }

      const { status, rejectReason } = bodyValidation.data
      const reviewerId = req.userId! // ID sếp/quản lý lấy từ middleware verifyToken

      // 3. Kiểm tra đơn có tồn tại không
      const existingRequest = await prisma.request.findUnique({
        where: {
          id: idValidation.data.id
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true
            }
          },
          reviewer: {
            select: {
              fullName: true
            }
          }
        }
      })

      if (!existingRequest) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy đơn yêu cầu"
        })
      }

      // 4. Kiểm tra logic nghiệp vụ: Chỉ cho phép duyệt đơn đang ở trạng thái PENDING
      if (existingRequest.status !== "PENDING") {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Đơn yêu cầu này đã được xử lý trước đó"
        })
      }

      // 5. Thực hiện cập nhật DB (Dùng Transaction để đảm bảo tính an toàn)
      const updatedRequest = await prisma.$transaction(async tx => {
        // 5.1 Cập nhật trạng thái đơn yêu cầu
        const request = await tx.request.update({
          where: { id: idValidation.data.id },
          data: {
            status,
            reviewedBy: reviewerId,
            rejectReason: status === "REJECTED" ? rejectReason : null
          }
        })

        // 5.2 (Tùy chọn nghiệp vụ): Nếu đơn LEAVE được APPROVED -> Trừ số ngày nghỉ vào leaveBalance của User
        if (status === "APPROVED" && existingRequest.type === "LEAVE") {
          // Tính số ngày nghỉ (chênh lệch giữa endDate và startDate)
          const start = new Date(existingRequest.startDate)
          const end = new Date(existingRequest.endDate)
          const diffTime = Math.abs(end.getTime() - start.getTime())
          const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

          // Trừ bớt leaveBalance của nhân viên
          await tx.user.update({
            where: { id: existingRequest.userId },
            data: {
              leaveBalance: {
                decrement: days
              }
            }
          })
        }

        return request
      })

      await createNotification({
        userId: existingRequest.userId,

        type: status === "APPROVED" ? NotificationType.REQUEST_APPROVED : NotificationType.REQUEST_REJECTED,

        title: status === "APPROVED" ? "Đơn yêu cầu đã được duyệt" : "Đơn yêu cầu bị từ chối",

        message:
          status === "APPROVED"
            ? "Đơn yêu cầu của bạn đã được quản lý phê duyệt"
            : `Đơn yêu cầu của bạn đã bị từ chối${rejectReason ? `. Lý do: ${rejectReason}` : ""}`,

        requestId: updatedRequest.id
      })

      return res.status(StatusCodes.OK).json({
        message: status === "APPROVED" ? "Phê duyệt đơn thành công" : "Từ chối đơn thành công",
        data: updatedRequest
      })
    } catch (error) {
      next(error)
    }
  }

  public updateRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idValidation = RequestValidation.getRequestId.safeParse(req.params)
      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }
      const bodyValidation = RequestValidation.updateRequest.safeParse(req.body)
      if (!bodyValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: bodyValidation.error.flatten().fieldErrors
        })
      }

      const existingRequest = await prisma.request.findUnique({
        where: { id: idValidation.data.id }
      })

      if (!existingRequest) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy đơn yêu cầu"
        })
      }

      if (existingRequest.status !== "PENDING") {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Không thể chỉnh sửa đơn đã được duyệt hoặc bị từ chối"
        })
      }

      const updatedRequest = await prisma.request.update({
        where: {
          id: idValidation.data.id
        },
        data: {
          ...bodyValidation.data
        }
      })

      if (updatedRequest.status === "APPROVED") {
        await createNotification({
          userId: updatedRequest.userId,
          type: NotificationType.REQUEST_APPROVED,
          title: "Đơn đã được duyệt",
          message: "Đơn yêu cầu của bạn đã được duyệt",
          requestId: updatedRequest.id
        })
      }

      if (updatedRequest.status === "REJECTED") {
        await createNotification({
          userId: updatedRequest.userId,
          type: NotificationType.REQUEST_REJECTED,
          title: "Đơn bị từ chối",
          message: "Đơn yêu cầu của bạn đã bị từ chối",
          requestId: updatedRequest.id
        })
      }

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_UPDATE,
        data: updatedRequest
      })
    } catch (error) {
      next(error)
    }
  }

  public deleteRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idValidation = RequestValidation.deleteRequest.safeParse(req.params)
      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }

      const existingRequest = await prisma.request.findUnique({
        where: { id: idValidation.data.id }
      })

      if (!existingRequest) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy đơn yêu cầu"
        })
      }

      await prisma.request.delete({
        where: {
          id: idValidation.data.id
        }
      })

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_DELETE
      })
    } catch (error) {
      next(error)
    }
  }
}
