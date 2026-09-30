import { axiosClient } from "@/api/axiosClient"
import type { TodayAttendanceResponse, AttendanceListResponse, AttendanceStatsResponse } from "@/types/attendanceType"

export type GetAttendanceHistoryParams = {
  page?: number
  limit?: number
  month?: string
  year?: string
  filterType?: string
}

export const attendanceService = {
  // Lấy chấm công hôm nay
  getToday: () => axiosClient.get<TodayAttendanceResponse>("/attendance/today").then(r => r.data),

  // Lấy lịch sử chấm công của tôi (phân trang + lọc)
  getHistory: (params: GetAttendanceHistoryParams) => axiosClient.get<AttendanceListResponse>("/attendance/me", { params }).then(r => r.data),

  // Lấy thống kê chấm công tháng này
  getStats: () => axiosClient.get<AttendanceStatsResponse>("/attendance/me/stats").then(r => r.data),

  // Chấm công vào
  checkIn: () => axiosClient.post("/attendance/check-in").then(r => r.data),

  // Chấm công ra
  checkOut: () => axiosClient.post("/attendance/check-out").then(r => r.data)
}
