import type { PaginationType } from "./globalType"

export type Status_task = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED"
export type Priority_task = "NORMAL" | "MEDIUM" | "HIGH"

export const TASK_TYPE_OPTIONS = [
  { label: "Tất cả trạng thái", value: "ALL" },
  { label: "Cần làm", value: "TODO" },
  { label: "Đang làm", value: "IN_PROGRESS" },
  { label: "Chờ duyệt", value: "IN_REVIEW" },
  { label: "Đã hoàn thành", value: "COMPLETED" }
]

export const TASK_PRIORITY_OPTIONS = [
  { label: "Tất cả ưu tiên", value: "ALL" },
  { value: "HIGH", label: "Ưu tiên cao" },
  { value: "MEDIUM", label: "Trung bình" },
  { value: "NORMAL", label: "Bình thường" }
]

export const TABLE_COLUMNS_TASK = [
  { value: "ID", label: "ID" },
  { value: "TITLE", label: "Tiêu đề" },
  { value: "ASSIGNEE", label: "Người phụ trách" },
  { value: "PRIORITY", label: "Độ ưu tiên" },
  { value: "DUE_DATE", label: "Ngày hết hạn" },
  { value: "STATUS", label: "Trạng thái" },
  { value: "ACTIONS", label: "Hành động" }
]

type Assignee_task = {
  id: string
  fullName: string
}

type Creator_task = {
  id: string
  fullName: string
}

export type TaskItem = {
  id: string
  title: string
  description: string
  status: Status_task
  priority: Priority_task
  dueDate: string
  assignee: Assignee_task
  creator: Creator_task
  createdAt: string
  updatedAt: string
}

export type TaskResponse = {
  message: string
  data: TaskItem[] | null
}

export type TaskListResponse = {
  message: string
  data: TaskItem[]
  pagination: PaginationType
}

export type TaskListParams = {
  status?: string
  priority?: string
  page?: number
  limit?: number
}
