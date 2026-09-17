import { io } from "../server.js"
import { prisma } from "../config/db.js"

export enum NotificationType {
  NEW_REQUEST = "NEW_REQUEST",
  REQUEST_APPROVED = "REQUEST_APPROVED",
  REQUEST_REJECTED = "REQUEST_REJECTED",

  NEW_TASK = "NEW_TASK",
  TASK_UPDATED = "TASK_UPDATED",
  TASK_COMPLETED = "TASK_COMPLETED"
}

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  requestId?: string
  taskId?: string
}

export const createNotification = async ({ userId, type, title, message, requestId, taskId }: CreateNotificationParams) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      requestId,
      taskId
    }
  })

  io.to(userId).emit("notification", notification)

  return notification
}
