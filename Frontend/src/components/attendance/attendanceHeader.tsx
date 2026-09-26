import { Clock } from "lucide-react"

const AttendanceHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-x-3">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
          <Clock size={26} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Chấm công</h1>
          <p className="text-slate-500 text-2xl font-normal mt-2">Theo dõi giờ vào/ra và lịch sử chấm công hằng ngày của bạn</p>
        </div>
      </div>
    </div>
  )
}

export default AttendanceHeader
