import { z } from "zod"
import { task_status, priority_level } from "@prisma/client"
import { FIELD_MESSAGE } from "../constant/systemMessage.js"

const taskId = z.object({
  id: z.string().uuid("ID công việc phải là UUID hợp lệ")
})

const BaseTasks = z.object({
  title: z.string({ message: FIELD_MESSAGE.FIELD_NOT_EMPTY }).min(1, "Tiêu đề công việc là bắt buộc").trim(),
  description: z.string({ message: FIELD_MESSAGE.FIELD_NOT_EMPTY }).min(1, "Mô tả công việc là bắt buộc").trim(),
  status: z.nativeEnum(task_status).default(task_status.TODO),
  priority: z.nativeEnum(priority_level).default(priority_level.LOW),
  assigneeId: z.string().uuid("assigneeId phải là UUID hợp lệ"),
  creatorId: z.string().uuid("creatorId phải là UUID hợp lệ"),
  departmentId: z.string().uuid().optional().nullable(),
  dueDate: z.coerce.date({ message: "Hạn hoàn thành (dueDate) không hợp lệ" })
})

export const TaskValidation = {
  getTaskId: taskId,

  createTask: BaseTasks,

  updateTask: z.object({
    title: z.string().min(1).trim().optional(),
    description: z.string().min(1).trim().optional(),
    status: z.nativeEnum(task_status).optional(),
    priority: z.nativeEnum(priority_level).optional(),
    assigneeId: z.string().uuid().optional(),
    creatorId: z.string().uuid().optional(),
    departmentId: z.coerce.number().positive().optional(),
    dueDate: z.coerce.date().optional()
  }),

  patchTask: BaseTasks.partial().refine(data => Object.keys(data).length > 0, {
    message: "Cần truyền ít nhất một trường để cập nhật"
  }),

  deleteTask: taskId
}
