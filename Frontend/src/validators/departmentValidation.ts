import z from "zod"

export const departmentSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Vui lòng nhập tên phòng ban"),
  managerId: z.string().optional()
})

export type DepartmentFormValidation = z.infer<typeof departmentSchema>
