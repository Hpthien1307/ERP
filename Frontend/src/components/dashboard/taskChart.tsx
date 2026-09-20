// components/dashboard/taskChart.tsx
import { ListChecks } from "lucide-react"
import { StatChartCard, ChartEmpty } from "./statChartCard"
import type { DashboardStatsResponse } from "@/types/dashboardType"

type TaskChartProps = {
  data: DashboardStatsResponse["data"]["task"]
}

const TaskChart = ({ data }: TaskChartProps) => {
  const items = [
    { name: "Cần xử lý", value: data.todo, color: "#f59e0b" },
    { name: "Đang làm", value: data.inProgress, color: "#2563eb" },
    { name: "Chờ duyệt", value: data.inReview, color: "#8b5cf6" },
    { name: "Hoàn thành", value: data.completed, color: "#10b981" },
    { name: "Quá hạn", value: data.overDue, color: "#f43f5e" }
  ]

  const max = Math.max(...items.map(i => i.value), 1)
  const completionRate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0

  return (
    <StatChartCard icon={<ListChecks size={20} className="text-blue-600" />} title="Quản lý công việc" summary={`${data.total} công việc`}>
      {data.total === 0 ? (
        <ChartEmpty />
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex flex-col gap-y-4 py-2">
            {items.map(item => (
              <div key={item.name} className="flex items-center gap-x-3">
                <span className="text-slate-500 text-lg w-24 shrink-0">{item.name}</span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color }} />
                </div>
                <span className="text-slate-800 font-semibold text-lg w-6 text-right shrink-0">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between gap-6">
            <span className="text-slate-500 text-2xl">Tỷ lệ hoàn thành</span>
            <div className="flex items-center gap-4 flex-1">
              <div className="w-full  h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${completionRate}%` }} />
              </div>
              <span className="text-emerald-600 font-bold text-2xl w-10">{completionRate}%</span>
            </div>
          </div>
        </div>
      )}
    </StatChartCard>
  )
}

export default TaskChart
