import { CalendarClock, Filter, Search } from "lucide-react"
import Input from "../ui/input"
import Select from "../ui/select"
import { SELECT_ATT_OPTIONS } from "@/types/attendanceType"

type AttendaceFilterProps = {
  today: string
  filterDate: string
  filterStatus: string
  setFilterDate: (search: string) => void
  setFilterStatus: (filter: string) => void
}

const AttendaceFilter = ({ today, filterDate, filterStatus, setFilterDate, setFilterStatus }: AttendaceFilterProps) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-x-2.5 shrink-0">
        <CalendarClock size={20} className="text-slate-400" />
        <h3 className="text-2xl font-bold text-slate-900">Lịch sử chấm công</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Tìm theo ngày..."
            max={today}
            type="date"
            icon={<Search size={18} />}
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
          <Select icon={<Filter size={18} />} options={SELECT_ATT_OPTIONS} value={filterStatus} onChange={e => setFilterStatus(e.target.value)} />
        </div>
      </div>
    </div>
  )
}

export default AttendaceFilter
