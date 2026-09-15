import { z } from "zod"
import { request_type, request_status } from "@prisma/client"
import { FIELD_MESSAGE } from "../constant/systemMessage.js"

const RequestId = z.object({
  id: z.string().uuid("ID đơn yêu cầu phải là UUID hợp lệ")
})

const BaseRequest = z.object({
  type: z.nativeEnum(request_type, { message: "Loại yêu cầu không hợp lệ" }),
  startDate: z.coerce.date({ message: "Ngày bắt đầu không hợp lệ" }),
  endDate: z.coerce.date({ message: "Ngày kết thúc không hợp lệ" }),
  reason: z.string({ message: FIELD_MESSAGE.FIELD_NOT_EMPTY }).trim().min(1, "Lý do là bắt buộc")
})

const ReviewRequest = z
  .object({
    status: z.enum([request_status.APPROVED, request_status.REJECTED], {
      message: "Trạng thái phê duyệt phải là APPROVED hoặc REJECTED"
    }),
    rejectReason: z.string().trim().optional()
  })
  .refine(
    data => {
      if (data.status === request_status.REJECTED) {
        return !!data.rejectReason && data.rejectReason.length > 0
      }
      return true
    },
    {
      message: "Lý do từ chối là bắt buộc khi không phê duyệt đơn",
      path: ["rejectReason"]
    }
  )

export const RequestValidation = {
  createRequest: BaseRequest.refine(data => data.endDate >= data.startDate, {
    message: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
    path: ["endDate"]
  }),

  reviewRequest: ReviewRequest,

  updateRequest: BaseRequest.partial().refine(data => Object.keys(data).length > 0, {
    message: "Cần truyền ít nhất một trường để cập nhật"
  }),

  getRequestId: RequestId,

  deleteRequest: RequestId
}
