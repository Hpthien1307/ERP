import { z } from "zod"

// const emptyString = () => z.string().trim()

export const profileSchema = z.object({
  // id: z.string().uuid("ID không hợp lệ"),
  // fullName: z.string().trim().min(2, "Họ và tên phải có ít nhất 2 ký tự").max(50, "Họ và tên không được vượt quá 50 ký tự"),
  // email: z.string().trim().email("Email không hợp lệ").or(z.literal("")),
  // phoneNumber: z
  //   .string()
  //   .trim()
  //   .regex(/^(0[35789])[0-9]{8}$/, "Số điện thoại không đúng định dạng")
  //   .or(z.literal("")),
  // gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  // birthday: emptyString(),
  // address: z.string().trim().max(200, "Địa chỉ tối đa 200 ký tự"),
  // department: z.string(),
  // position: z.string(),
  // role: z.string(),
  // bio: z.string().trim().max(500, "Tiểu sử tối đa 500 ký tự")
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  phoneNumber: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  birthday: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional()
})

export type ProfileFormValidation = z.infer<typeof profileSchema>
