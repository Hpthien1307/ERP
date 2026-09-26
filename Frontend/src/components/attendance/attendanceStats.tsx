import { AlertCircle, CheckCircle2, TrendingUp, XCircle } from "lucide-react"
import useFetch from "@/hooks/useFetch"
import type { AttendanceStatsResponse } from "@/types/attendanceType"
const AttendanceStats = () => {
  const { data: statsData } = useFetch<AttendanceStatsResponse>({
    url: "/attendance/me/stats",
    key: ["attendance-stats"]
  })
  const stats = statsData?.data
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 size={26} />
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 text-xl font-medium">Ngày đúng giờ</span>
          <span className="text-3xl font-bold text-emerald-600">{stats?.onTime ?? 0}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <AlertCircle size={26} />
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 text-xl font-medium">Ngày đi trễ</span>
          <span className="text-3xl font-bold text-amber-600">{stats?.late ?? 0}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <XCircle size={26} />
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 text-xl font-medium">Ngày vắng mặt</span>
          <span className="text-3xl font-bold text-rose-600">{stats?.absent ?? 0}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <TrendingUp size={26} />
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 text-xl font-medium">Giờ làm TB/ngày</span>
          <span className="text-3xl font-bold text-slate-900">{stats?.avgWorkingHours ?? 0}</span>
        </div>
      </div>
    </div>
  )
}

export default AttendanceStats
