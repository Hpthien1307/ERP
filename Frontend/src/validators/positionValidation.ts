import z from "zod"

export const positionSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Vui lòng nhập tên vị trí / chức vụ"),
  departmentId: z.string().min(1, "Vui lòng chọn phòng ban")
})

export type PositionFormValidation = z.infer<typeof positionSchema>
