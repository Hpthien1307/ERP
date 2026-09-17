import z from "zod"

export const createAttendanceValidation = z.object({
  userId: z.string().min(1, "Thiếu userId"),
  type: z.string().min(1, "Thiếu loại")
})
