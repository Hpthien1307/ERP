import type { Response, NextFunction } from "express"
import type { AuthRequest } from "../middlewares/auth.middleware.js"
import { prisma } from "../config/db.js"
import { StatusCodes } from "http-status-codes"

export class NotificationController {
  public getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          userId: req.userId
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 50
      })

      return res.status(200).json({
        data: notifications
      })
    } catch (error) {
      next(error)
    }
  }

  public getUnreadCount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const count = await prisma.notification.count({
        where: {
          userId: req.userId,
          isRead: false
        }
      })

      return res.status(200).json({
        data: {
          count
        }
      })
    } catch (error) {
      next(error)
    }
  }

  public markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const notification = await prisma.notification.updateMany({
        where: {
          id: req.params.id as string,
          userId: req.userId as string
        },
        data: {
          isRead: true
        }
      })

      return res.status(StatusCodes.OK).json({
        message: "Đã đánh dấu thông báo đã đọc",
        data: notification
      })
    } catch (error) {
      next(error)
    }
  }

  public markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await prisma.notification.updateMany({
        where: {
          userId: req.userId,
          isRead: false
        },
        data: {
          isRead: true
        }
      })

      return res.status(200).json({
        message: "Đã đánh dấu tất cả thông báo đã đọc"
      })
    } catch (error) {
      next(error)
    }
  }
}
