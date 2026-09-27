import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { attendanceService, type GetAttendanceHistoryParams } from "@/service/attendanceService"

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const attendanceKeys = {
  all: ["attendance"] as const,
  today: () => ["attendance", "today"] as const,
  history: (params: GetAttendanceHistoryParams) => ["attendance", params] as const,
  stats: () => ["attendance", "stats"] as const
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Chấm công hôm nay */
export const useTodayAttendance = () =>
  useQuery({
    queryKey: attendanceKeys.today(),
    queryFn: attendanceService.getToday,
    staleTime: 1000 * 30 // 30 giây — refresh thường xuyên hơn
  })

/** Lịch sử chấm công (phân trang + lọc) */
export const useAttendanceHistory = (params: GetAttendanceHistoryParams) =>
  useQuery({
    queryKey: attendanceKeys.history(params),
    queryFn: () => attendanceService.getHistory(params),
    staleTime: 1000 * 60
  })

/** Thống kê chấm công tháng này */
export const useAttendanceStats = () =>
  useQuery({
    queryKey: attendanceKeys.stats(),
    queryFn: attendanceService.getStats,
    staleTime: 1000 * 60 * 5
  })

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Chấm công vào */
export const useCheckIn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: attendanceService.checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.today() })
      queryClient.invalidateQueries({ queryKey: attendanceKeys.stats() })
    }
  })
}

/** Chấm công ra */
export const useCheckOut = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: attendanceService.checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.today() })
      queryClient.invalidateQueries({ queryKey: attendanceKeys.stats() })
    }
  })
}
