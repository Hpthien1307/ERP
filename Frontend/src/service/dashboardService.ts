import { axiosClient } from "@/api/axiosClient"
import type { DashboardStatsResponse, EmployeeOption } from "@/types/dashboardType"

export type GetDashboardStatsParams = {
  userId?: string
}

export const dashboardService = {
  // Lấy danh sách nhân viên (chỉ Manager/Admin)
  getEmployees: () =>
    axiosClient.get<{ message: string; data: EmployeeOption[] }>("/dashboard/employees").then(r => r.data),

  // Lấy thống kê tổng quan (attendance, task, request)
  getStats: (params?: GetDashboardStatsParams) =>
    axiosClient.get<DashboardStatsResponse>("/dashboard/stats", { params }).then(r => r.data)
}
