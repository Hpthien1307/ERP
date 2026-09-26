type StatChartCardProps = {
  icon: React.ReactNode
  title: string
  summary: string
  children: React.ReactNode
}

export const StatChartCard = ({ icon, title, summary, children }: StatChartCardProps) => (
  <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-y-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-2.5">
        {icon}
        <h2 className="text-xg font-bold text-slate-900">{title}</h2>
      </div>
      <span className="text-slate-400 text-xg font-medium">{summary}</span>
    </div>
    {children}
  </div>
)

export type ChartDatum = { name: string; value: number; color: string }

export const ChartLegend = ({ data }: { data: ChartDatum[] }) => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
    {data.map(d => (
      <div key={d.name} className="flex items-center gap-x-2">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
        <span className="text-slate-500 text-2xl">{d.name}</span>
        <span className="text-slate-800 font-semibold text-2xl ml-auto">{d.value}</span>
      </div>
    ))}
  </div>
)

export const ChartEmpty = () => <div className="h-56 flex items-center justify-center text-slate-400 text-xl">Chưa có dữ liệu</div>
