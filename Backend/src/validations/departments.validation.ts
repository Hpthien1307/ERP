import { z } from "zod"
import { FIELD_MESSAGE } from "../constant/systemMessage.js"

const BaseDpSchema = z.object({
  title: z.string({ message: FIELD_MESSAGE.FIELD_NOT_EMPTY }).min(1, FIELD_MESSAGE.FIELD_REQUIRE).trim(),
  managerId: z.string().uuid("ID quản lý phải là UUID hợp lệ").nullable().optional()
})

const BaseDpId = z.object({
  id: z.string().uuid("ID phải là UUID hợp lệ")
})

export const DepartmentValidation = {
  getDpId: BaseDpId,

  createDp: BaseDpSchema,

  updateDp: BaseDpSchema.partial().refine(data => Object.keys(data).length > 0, {
    message: "Cần truyền ít nhất một trường để cập nhật"
  }),

  deleteDp: BaseDpId
}
