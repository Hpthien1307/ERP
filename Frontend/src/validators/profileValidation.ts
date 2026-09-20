import { z } from "zod"

export const profileSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  phoneNumber: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  birthday: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional()
})

export type ProfileFormValidation = z.infer<typeof profileSchema>
