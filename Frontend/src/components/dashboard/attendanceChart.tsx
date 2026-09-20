import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Clock } from "lucide-react"
import { StatChartCard, ChartLegend, ChartEmpty, type ChartDatum } from "./statChartCard"
import type { DashboardStatsResponse } from "@/types/dashboardType"

type AttendanceChartProps = {
  data: DashboardStatsResponse["data"]["attendance"]
}

const AttendanceChart = ({ data }: AttendanceChartProps) => {
  const chartData: ChartDatum[] = [
    { name: "Đúng giờ", value: data.onTime, color: "#10b981" },
    { name: "Đi trễ", value: data.late, color: "#f59e0b" },
    { name: "Vắng mặt", value: data.absent, color: "#f43f5e" }
  ]
  const total = chartData.reduce((sum, d) => sum + d.value, 0)

  return (
    <StatChartCard icon={<Clock size={20} className="text-blue-600" />} title="Chấm công tháng này" summary={`TB ${data.avgWorkingHours}h/ngày`}>
      {total === 0 ? (
        <ChartEmpty />
      ) : (
        <div className="flex flex-col gap-y-4">
          <div className="min-h-86">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={85}>
                  {chartData.map(entry => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 14 }} formatter={(value: number) => [`${value} ngày`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ChartLegend data={chartData} />
        </div>
      )}
    </StatChartCard>
  )
}

export default AttendanceChart
