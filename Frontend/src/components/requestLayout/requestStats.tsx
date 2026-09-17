import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react"

type RequestStatsProps = {
  activeTab: string
  user: {
    role: string
    id: string
  }
  stats: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
}

const RequestStats = ({ activeTab, user, stats }: RequestStatsProps) => {
  return (
    <>
      {/* 2. STATS CARDS TỔNG QUAN */}
      {activeTab === "mine" || user.role === "EMPLOYEE" ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText size={26} />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xl font-medium">Tổng số đơn</span>
              <span className="text-3xl font-bold text-slate-900">{stats.total}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock size={26} />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xl font-medium">Chờ phê duyệt</span>
              <span className="text-3xl font-bold text-amber-600">{stats.pending}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={26} />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xl font-medium">Đã phê duyệt</span>
              <span className="text-3xl font-bold text-emerald-600">{stats.approved}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle size={26} />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xl font-medium">Bị từ chối</span>
              <span className="text-3xl font-bold text-rose-600">{stats.rejected}</span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}

export default RequestStats
