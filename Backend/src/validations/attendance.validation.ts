import { z } from "zod"
import { attendance_status } from "@prisma/client"
export const AttendanceValidation = {
  getHistory: z.object({
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().min(2020).max(2100).optional(),
    userId: z.string().uuid("userId phải là UUID hợp lệ").optional(),
    departmentId: z.string().uuid("departmentId phải là UUID hợp lệ").optional(),
    filterDate: z.string().optional(),
    filterType: z.nativeEnum(attendance_status).optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10)
  }),

  attendanceId: z.object({
    id: z.string().uuid("ID chấm công phải là UUID hợp lệ")
  })
}
