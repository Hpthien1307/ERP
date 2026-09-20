import { useState } from "react"
import { useAuth } from "@/store/useAuth"
import useFetch from "@/hooks/useFetch"
import { Spinner } from "@/components/ui/spinner"
import { LayoutDashboard, XCircle } from "lucide-react"
import AttendanceChart from "@/components/dashboard/attendanceChart"
import TaskChart from "@/components/dashboard/taskChart"
import RequestChart from "@/components/dashboard/requestChart"
import EmployeeFilter from "@/components/dashboard/employeeFilter"
import type { DashboardStatsResponse, EmployeeOption } from "@/types/dashboardType"

const Dashboard = () => {
  const { user } = useAuth()
  const isManagerOrAdmin = user?.role === "MANAGER" || user?.role === "ADMIN"
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(user?.id ?? "")

  const { data: employeesData } = useFetch<{ message: string; data: EmployeeOption[] }>({
    url: "/dashboard/employees",
    key: ["dashboard_employees"],
    enabled: isManagerOrAdmin
  })

  const {
    data: statsData,
    isPending,
    error
  } = useFetch<DashboardStatsResponse>({
    url: "/dashboard/stats",
    key: ["dashboard_stats", selectedEmployeeId],
    params: { userId: selectedEmployeeId !== user?.id ? selectedEmployeeId : undefined }
  })

  const stats = statsData?.data

  return (
    <div className="max-w-full mx-auto flex flex-col gap-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-x-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <LayoutDashboard size={26} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Bảng điều khiển</h1>
            <p className="text-slate-500 text-2xl font-normal mt-2">Tổng quan chấm công, công việc và đơn từ</p>
          </div>
        </div>
      </div>

      {isManagerOrAdmin && (
        <EmployeeFilter
          currentUserId={user!.id}
          employees={employeesData?.data ?? []}
          selectedEmployeeId={selectedEmployeeId}
          onChange={setSelectedEmployeeId}
        />
      )}

      {isPending && (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-center">
          <Spinner className="size-16" />
        </div>
      )}

      {!isPending && error && (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center gap-y-3">
          <XCircle size={40} className="text-rose-300" />
          <p className="text-slate-500 text-2xl">Không thể tải dữ liệu bảng điều khiển. Vui lòng thử lại sau.</p>
        </div>
      )}

      {!isPending && !error && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AttendanceChart data={stats.attendance} />
          <TaskChart data={stats.task} />
          <RequestChart data={stats.request} />
        </div>
      )}
    </div>
  )
}

export default Dashboard
