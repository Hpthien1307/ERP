import z from "zod"
import { getTodayDateString } from "@/utils/formatters"

export const taskSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Vui lòng nhập tiêu đề công việc"),
  description: z.string().min(1, "Vui lòng nhập mô tả công việc"),
  assigneeId: z.string().uuid("assigneeId phải là UUID hợp lệ"),
  priority: z.enum(["HIGH", "MEDIUM", "NORMAL"]),
  dueDate: z.string().refine(dateStr => {
    const today = getTodayDateString()
    return dateStr >= today
  }, "Ngày kết thúc phải lớn hơn hoặc bằng ngày hiện tại"),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"])
})

export type TaskFormValidation = z.infer<typeof taskSchema>
