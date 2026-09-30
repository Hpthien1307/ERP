import z from "zod"

export const employeeSchema = z.object({
  id: z.string().uuid().optional(),
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  password: z.string().optional(),
  email: z.string().email("Vui lòng nhập email"),
  phone: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  birthday: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  leaveBalance: z.number().default(12).optional(),
  role: z.enum(["EMPLOYEE", "MANAGER", "ADMIN"]),
  departmentId: z.string().optional(),
  positionId: z.string().optional()
})

export type EmployeeFormValidation = z.infer<typeof employeeSchema>
