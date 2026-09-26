export type Notification = {
  id: string
  type: string
  title: string
  message: string
  requestId?: string | null
  taskId?: string | null
  isRead: boolean
  createdAt: string
}

export type NotificationResponse = {
  data: Notification[]
}

export type UnreadCountResponse = {
  data: {
    count: number
  }
}
