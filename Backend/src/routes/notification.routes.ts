import { Router } from "express"
import { NotificationController } from "../controllers/notification.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()

const notificationController = new NotificationController()

router.use(verifyToken)

router.get("/notifications", notificationController.getNotifications)

router.get("/notifications/unread-count", notificationController.getUnreadCount)

router.patch("/notifications/:id/read", notificationController.markAsRead)

router.patch("/notifications/read-all", notificationController.markAllAsRead)

export default router
