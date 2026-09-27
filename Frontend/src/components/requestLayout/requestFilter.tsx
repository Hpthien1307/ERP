import Input from "../ui/input"
import Select from "../ui/select"
import { Filter, Search } from "lucide-react"
import { REQUEST_TYPE_OPTIONS, REQUEST_STATUS_OPTIONS } from "@/types/requestType"

type RequestFilterProps = {
  search: string
  month: string
  year: string
  selectedType: string
  selectedStatus: string
  setSearch: (search: string) => void
  setMonth: (month: string) => void
  setYear: (year: string) => void
  setSelectedType: (selectedType: string) => void
  setSelectedStatus: (selectedStatus: string) => void
}

const NOW = new Date()
const CURRENT_YEAR = NOW.getFullYear()
const CURRENT_MONTH = NOW.getMonth() + 1 // 1-based

// Max = năm hiện tại, lùi tối đa 2 năm
const YEAR_OPTIONS = Array.from({ length: 3 }, (_, i) => {
  const year = CURRENT_YEAR - 2 + i
  return { value: String(year), label: `Năm ${year}` }
})

const RequestFilter = ({
  search,
  month,
  year,
  selectedType,
  selectedStatus,
  setSearch,
  setMonth,
  setYear,
  setSelectedType,
  setSelectedStatus
}: RequestFilterProps) => {
  const monthOptions = Array.from({ length: Number(year) === CURRENT_YEAR ? CURRENT_MONTH : 12 }, (_, i) => ({ value: String(i + 1), label: `Tháng ${i + 1}` }))
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="w-150">
        <Input placeholder="Tìm theo lý do" icon={<Search size={18} />} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Select Tháng */}
      <div className="w-full flex-1">
        <Select value={month} onChange={e => setMonth(e.target.value)} options={monthOptions} />
      </div>

      {/* Select Năm */}
      <div className="w-full flex-1">
        <Select value={year} onChange={e => setYear(e.target.value)} options={YEAR_OPTIONS} />
      </div>

      <div className="w-full flex-1">
        <Select icon={<Filter size={18} />} value={selectedType} onChange={e => setSelectedType(e.target.value)} options={REQUEST_TYPE_OPTIONS} />
      </div>
      <div className="w-full flex-1">
        <Select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} options={REQUEST_STATUS_OPTIONS} />
      </div>
    </div>
  )
}

export default RequestFilter
