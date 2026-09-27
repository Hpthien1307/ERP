import { CalendarClock, Filter, Search } from "lucide-react"
import Input from "../ui/input"
import Select from "../ui/select"
import { SELECT_ATT_OPTIONS } from "@/types/attendanceType"

type AttendaceFilterProps = {
  today: string
  month: string
  year: string
  filterDate: string
  filterStatus: string
  setMonth: (month: string) => void
  setYear: (year: string) => void
  setFilterDate: (search: string) => void
  setFilterStatus: (filter: string) => void
}

const NOW = new Date()
const CURRENT_YEAR = NOW.getFullYear()
const CURRENT_MONTH = NOW.getMonth() + 1 // 1-based

// Max = năm hiện tại, lùi tối đa 2 năm
const YEAR_OPTIONS = Array.from({ length: 3 }, (_, i) => {
  const year = CURRENT_YEAR - 2 + i
  return { value: String(year), label: `Năm ${year}` }
})

const AttendaceFilter = ({ today, month, year, filterDate, filterStatus, setMonth, setYear, setFilterDate, setFilterStatus }: AttendaceFilterProps) => {
  const monthOptions = Array.from({ length: Number(year) === CURRENT_YEAR ? CURRENT_MONTH : 12 }, (_, i) => ({ value: String(i + 1), label: `Tháng ${i + 1}` }))
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-x-2.5 shrink-0">
        <CalendarClock size={20} className="text-slate-400" />
        <h3 className="text-2xl font-bold text-slate-900">Lịch sử chấm công</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        {/* Select Tháng */}
        <div className="w-full flex-1">
          <Select value={month} onChange={e => setMonth(e.target.value)} options={monthOptions} />
        </div>

        {/* Select Năm */}
        <div className="w-full flex-1">
          <Select value={year} onChange={e => setYear(e.target.value)} options={YEAR_OPTIONS} />
        </div>
        <div className="w-full flex-1">
          <Select icon={<Filter size={18} />} options={SELECT_ATT_OPTIONS} value={filterStatus} onChange={e => setFilterStatus(e.target.value)} />
        </div>
      </div>
    </div>
  )
}

export default AttendaceFilter
