import { axiosClient } from "@/api/axiosClient"
import type { GetTasksParams, TaskListResponse } from "@/types/taskType"
import type { TaskFormValidation } from "@/validators/taskValidation"
import type { TaskStatsFields } from "@/components/task/taskStats"

export type UpdateTaskStatusPayload = { status: string }

export const taskService = {
  // Lấy tất cả công việc
  getAll: (params: GetTasksParams) => axiosClient.get<TaskListResponse>("/task", { params }).then(r => r.data),

  // Lấy công việc của tôi
  getMine: (params: GetTasksParams) => axiosClient.get<TaskListResponse>("/task/me", { params }).then(r => r.data),

  // Lấy thống kê công việc
  getStats: (params: GetTasksParams) => axiosClient.get<{ message: string; data: TaskStatsFields }>("/task/stats", { params }).then(r => r.data),

  // Tạo công việc mới
  create: (data: TaskFormValidation) => axiosClient.post("/task", data).then(r => r.data),

  // Cập nhật công việc (toàn bộ hoặc một phần)
  update: (id: string, data: Partial<TaskFormValidation>) => axiosClient.patch(`/task/${id}`, data).then(r => r.data),

  // Xóa công việc
  remove: (id: string) => axiosClient.delete(`/task/${id}`).then(r => r.data)
}
