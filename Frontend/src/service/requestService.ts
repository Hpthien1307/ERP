import { axiosClient } from "@/api/axiosClient"
import type { PaginatedRequestResponse } from "@/types/requestType"
import type { RequestFormValidated } from "@/validators/requestValidation"
import type { RequestStatsFields } from "@/components/requestLayout/requestStats"

export type GetRequestsParams = {
  page?: number
  limit?: number
  search?: string
  type?: string
  status?: string
}

export type ReviewPayload = {
  status: "APPROVED" | "REJECTED"
  rejectReason?: string
}

export const requestService = {
  // Lấy danh sách đơn của tôi (có phân trang + lọc)
  getMyRequests: (params: GetRequestsParams) => axiosClient.get<PaginatedRequestResponse>("/request/user", { params }).then(r => r.data),

  // Lấy danh sách đơn cần duyệt (Manager/Admin)
  getReviewRequests: (params: GetRequestsParams) => axiosClient.get<PaginatedRequestResponse>("/request/manager", { params }).then(r => r.data),

  // Lấy thống kê đơn từ
  getStats: (params: GetRequestsParams) => axiosClient.get<{ message: string; data: RequestStatsFields }>("/request/stats", { params }).then(r => r.data),

  // Tạo đơn mới
  create: (data: RequestFormValidated & { userId: string }) => axiosClient.post("/request", data).then(r => r.data),

  // Duyệt / từ chối đơn
  review: (id: string, payload: ReviewPayload) => axiosClient.patch(`/request/${id}/review`, payload).then(r => r.data)
}
