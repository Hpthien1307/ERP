import { z } from "zod"
import { FIELD_MESSAGE } from "../constant/systemMessage.js"

export const AuthValidation = {
  signin: z.object({
    email: z.string({ message: FIELD_MESSAGE.FIELD_NOT_EMPTY }).email("Email không hợp lệ").toLowerCase().trim(),
    password: z.string({ message: FIELD_MESSAGE.FIELD_NOT_EMPTY }).min(1, "Mật khẩu không được để trống")
  }),

  refreshToken: z.object({
    refreshToken: z.string().min(1, "Refresh token không được để trống")
  })
}
