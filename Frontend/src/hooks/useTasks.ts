import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { taskService } from "@/service/taskService"
import type { TaskFormValidation } from "@/validators/taskValidation"
import type { GetTasksParams } from "@/types/taskType"

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const taskKeys = {
  all: ["tasks"] as const,
  list: (isMyTask: boolean, params: GetTasksParams) => ["tasks", isMyTask ? "my_tasks" : "all_tasks", params] as const,
  stats: (params: GetTasksParams) => ["tasks", "stats", params] as const
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Danh sách công việc (tất cả hoặc của tôi) */
export const useTasks = (isMyTask: boolean, params: GetTasksParams) =>
  useQuery({
    queryKey: taskKeys.list(isMyTask, params),
    queryFn: () => (isMyTask ? taskService.getMine(params) : taskService.getAll(params)),
    staleTime: 1000 * 60
  })

/** Thống kê công việc */
export const useTaskStats = (params: GetTasksParams) =>
  useQuery({
    queryKey: taskKeys.stats(params),
    queryFn: () => taskService.getStats(params),
    staleTime: 1000 * 60 * 5
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Tạo công việc mới */
export const useCreateTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TaskFormValidation) => taskService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    }
  })
}

/** Cập nhật công việc (toàn bộ hoặc chỉ status) */
export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskFormValidation> }) => taskService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    }
  })
}

/** Xóa công việc */
export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => taskService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
    }
  })
}
