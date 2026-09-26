import Input from "../ui/input"
import Select from "../ui/select"
import { Filter, Search } from "lucide-react"
import { REQUEST_TYPE_OPTIONS, REQUEST_STATUS_OPTIONS } from "@/types/requestType"

type RequestFilterProps = {
  search: string
  selectedType: string
  selectedStatus: string
  setSearch: (search: string) => void
  setSelectedType: (selectedType: string) => void
  setSelectedStatus: (selectedStatus: string) => void
}

const RequestFilter = ({ search, selectedType, selectedStatus, setSearch, setSelectedType, setSelectedStatus }: RequestFilterProps) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="w-full flex-1">
        <Input placeholder="Tìm theo lý do, người gửi..." icon={<Search size={18} />} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <div className="w-full sm:w-80">
          <Select icon={<Filter size={18} />} value={selectedType} onChange={e => setSelectedType(e.target.value)} options={REQUEST_TYPE_OPTIONS} />
        </div>

        <div className="w-full sm:w-80">
          <Select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} options={REQUEST_STATUS_OPTIONS} />
        </div>
      </div>
    </div>
  )
}

export default RequestFilter
