import z from "zod"
import { FIELD_MESSAGE } from "../constant/systemMessage.js"

export const BasePositionSchema = z.object({
  title: z.string({ message: FIELD_MESSAGE.FIELD_NOT_EMPTY }).min(1, FIELD_MESSAGE.FIELD_REQUIRE).trim(),
  userIds: z.array(z.string().uuid("ID nhân viên phải là UUID")).optional()
})

export const BasePositionId = z.object({
  id: z.string().uuid("ID phải là UUID hợp lệ")
})

export const PositionValidation = {
  getPosition: BasePositionSchema,

  getPositionId: BasePositionId,

  createPosition: BasePositionSchema,

  updatePosition: BasePositionSchema.partial().refine(data => Object.keys(data).length > 0, {
    message: "Cần truyền ít nhất một trường để cập nhật"
  }),

  deletePosition: BasePositionId
}
