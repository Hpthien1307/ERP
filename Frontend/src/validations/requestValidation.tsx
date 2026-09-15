import z from "zod"
import type { RequestType } from "@/types/requestType"

export const createRequestSchema = z.object({
  type: z.enum(["LEAVE", "WFH", "OT"]),
  startDate: z.coerce.date({ message: "Ngày bắt đầu không hợp lệ" }),
  endDate: z.coerce.date({ message: "Ngày kết thúc không hợp lệ" }),
  reason: z
    .string()
    .trim()
    .min(1, "Lý do không được để trống")
    .min(2, "Lý do phải có ít nhất 2 ký tự")
    .max(500, "Lý do không được vượt quá 500 ký tự")
})

export type RequestFormState = {
  type: RequestType
  startDate: string
  endDate: string
  reason: string
}

export type RequestFormValidated = z.infer<typeof createRequestSchema>
