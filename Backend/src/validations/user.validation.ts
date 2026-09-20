import { z } from "zod"
import { role_type, gender_type } from "@prisma/client"
import { FIELD_MESSAGE } from "../constant/systemMessage.js"

const BaseUserSchema = z.object({
  email: z.string({ message: FIELD_MESSAGE.FIELD_NOT_EMPTY }).email("Email không đúng định dạng").toLowerCase().trim(),
  password: z.string({ message: FIELD_MESSAGE.FIELD_NOT_EMPTY }).min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  avatarUrl: z.string().url("URL hình ảnh không hợp lệ").nullable().optional(),
  fullName: z.string({ message: FIELD_MESSAGE.FIELD_NOT_EMPTY }).min(1, FIELD_MESSAGE.FIELD_REQUIRE).trim(),
  gender: z.nativeEnum(gender_type).optional(),
  birthday: z.preprocess(val => (val === "" || val === undefined ? null : val), z.coerce.date().nullable().optional()),
  role: z.nativeEnum(role_type),
  phone: z.string().nullable().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  leaveBalance: z.number().int().nonnegative(),
  departmentId: z.string().uuid().optional().nullable(),
  positionId: z.string().uuid().optional().nullable()
})

const BaseUserId = z.object({
  id: z.string().uuid("ID người dùng phải là UUID hợp lệ")
})

export const UserValidation = {
  getUsers: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().trim().optional(),
    role: z.nativeEnum(role_type).optional(),
    departmentId: z.string().uuid().optional(),
    positionId: z.string().uuid().optional()
  }),

  getUserId: BaseUserId,

  createUser: BaseUserSchema.extend({
    role: z.nativeEnum(role_type).default(role_type.EMPLOYEE),
    leaveBalance: z.number().int().nonnegative().default(12)
  }),

  updateUser: BaseUserSchema.partial().refine(data => Object.keys(data).length > 0, {
    message: "Cần truyền ít nhất một trường để cập nhật"
  }),

  deleteUser: BaseUserId
}
