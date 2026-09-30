import { useQuery } from "@tanstack/react-query"
import { dashboardService, type GetDashboardStatsParams } from "@/service/dashboardService"

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const dashboardKeys = {
  all: ["dashboard"] as const,
  employees: () => ["dashboard", "employees"] as const,
  stats: (params?: GetDashboardStatsParams) => ["dashboard", "stats", params] as const
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Danh sách nhân viên — chỉ kích hoạt khi isManagerOrAdmin */
export const useDashboardEmployees = (enabled: boolean) =>
  useQuery({
    queryKey: dashboardKeys.employees(),
    queryFn: dashboardService.getEmployees,
    enabled,
    staleTime: 1000 * 60 * 10
  })

/** Thống kê tổng quan (có thể lọc theo userId) */
export const useDashboardStats = (params?: GetDashboardStatsParams) =>
  useQuery({
    queryKey: dashboardKeys.stats(params),
    queryFn: () => dashboardService.getStats(params),
    staleTime: 1000 * 60
  })
