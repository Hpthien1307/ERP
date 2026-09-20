import { AlertTriangle, CheckCircle2, Clock, Layers, ListTodo } from "lucide-react"

type TaskStats = {
  statsData: {
    total: number
    inProgress: number
    todo: number
    inReview: number
    completed: number
    overDue: number
  }
}

const TaskStats = ({ statsData }: TaskStats) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Layers size={26} />
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 text-xl font-medium">Tổng công việc</span>
          <span className="text-3xl font-bold text-slate-900">{statsData.total}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <Clock size={26} />
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 text-xl font-medium">Đang thực hiện</span>
          <span className="text-3xl font-bold text-sky-600">{statsData.inProgress}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <ListTodo size={26} />
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 text-xl font-medium">Cần xử lý</span>
          <span className="text-3xl font-bold text-amber-600">{statsData.todo}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 size={26} />
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 text-xl font-medium">Đã hoàn thành</span>
          <span className="text-3xl font-bold text-emerald-600">{statsData.completed}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4 col-span-2 md:col-span-1">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <AlertTriangle size={26} />
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 text-xl font-medium">Quá hạn / Khẩn cấp</span>
          <span className="text-3xl font-bold text-rose-600">{statsData.overDue}</span>
        </div>
      </div>
    </div>
  )
}

export default TaskStats
