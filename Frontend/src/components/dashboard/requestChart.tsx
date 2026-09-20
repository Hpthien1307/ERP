import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { FileText } from "lucide-react"
import { StatChartCard, ChartLegend, ChartEmpty, type ChartDatum } from "./statChartCard"
import type { DashboardStatsResponse } from "@/types/dashboardType"

type RequestChartProps = {
  data: DashboardStatsResponse["data"]["request"]
}

const RequestChart = ({ data }: RequestChartProps) => {
  const chartData: ChartDatum[] = [
    { name: "Chờ duyệt", value: data.pending, color: "#f59e0b" },
    { name: "Đã duyệt", value: data.approved, color: "#10b981" },
    { name: "Từ chối", value: data.rejected, color: "#f43f5e" }
  ]

  return (
    <StatChartCard icon={<FileText size={20} className="text-blue-600" />} title="Đơn từ & nghỉ phép" summary={`${data.total} đơn`}>
      {data.total === 0 ? (
        <ChartEmpty />
      ) : (
        <div className="flex flex-col gap-y-4">
          <div className="h-86">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={85} paddingAngle={2}>
                  {chartData.map(entry => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 14 }} formatter={value => [`${value} đơn`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ChartLegend data={chartData} />
        </div>
      )}
    </StatChartCard>
  )
}

export default RequestChart
