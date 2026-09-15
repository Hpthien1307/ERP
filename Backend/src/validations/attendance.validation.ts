import { z } from "zod"

export const AttendanceValidation = {
  getHistory: z.object({
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().min(2020).max(2100).optional(),
    userId: z.string().uuid("userId phải là UUID hợp lệ").optional(),
    departmentId: z.string().uuid("departmentId phải là UUID hợp lệ").optional()
  }),

  attendanceId: z.object({
    id: z.string().uuid("ID chấm công phải là UUID hợp lệ")
  })
}
