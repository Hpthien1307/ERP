import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { requestService, type GetRequestsParams, type ReviewPayload } from "@/service/requestService"
import type { RequestFormValidated } from "@/validators/requestValidation"

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const requestKeys = {
  all: ["request"] as const,
  mine: (params: GetRequestsParams) => ["request", "mine", params] as const,
  review: (params: GetRequestsParams) => ["request", "review", params] as const,
  stats: (params: GetRequestsParams) => ["request", "stats", params] as const
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Đơn của tôi (phân trang + lọc) */
export const useMyRequests = (params: GetRequestsParams) =>
  useQuery({
    queryKey: requestKeys.mine(params),
    queryFn: () => requestService.getMyRequests(params),
    staleTime: 1000 * 60
  })

/** Đơn cần duyệt — chỉ kích hoạt khi isManagerOrAdmin + đang ở tab "review" */
export const useReviewRequests = (params: GetRequestsParams, enabled: boolean) =>
  useQuery({
    queryKey: requestKeys.review(params),
    queryFn: () => requestService.getReviewRequests(params),
    enabled,
    staleTime: 1000 * 60
  })

/** Thống kê đơn từ */
export const useRequestStats = (params: GetRequestsParams) =>
  useQuery({
    queryKey: requestKeys.stats(params),
    queryFn: () => requestService.getStats(params),
    staleTime: 1000 * 60 * 5
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Tạo đơn mới */
export const useCreateRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RequestFormValidated & { userId: string }) => requestService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all })
    }
  })
}

/** Duyệt / từ chối đơn */
export const useReviewRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReviewPayload }) => requestService.review(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all })
    }
  })
}
