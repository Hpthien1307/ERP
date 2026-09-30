import { Filter, Search } from "lucide-react"
import Input from "../ui/input"
import Select from "../ui/select"
import React from "react"

type PositionsFilterProps = {
  search: string
  selectedDepartment: string
  departmentOptions: { value: string; label: string }[]
  setSearch: (search: string) => void
  setSelectedDepartment: (selectedDepartment: string) => void
}

const PositionsFilter = ({
  search,
  selectedDepartment,
  departmentOptions,
  setSearch,
  setSelectedDepartment
}: PositionsFilterProps) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-x-2 text-slate-800 font-semibold text-2xl">
          <Filter size={18} className="text-blue-600" />
          <span>Bộ lọc chức vụ</span>
        </div>
      </div>

      <div className="flex items-center flex-col sm:flex-row gap-4">
        {/* Input Tìm kiếm */}
        <div className="flex-1 w-full">
          <Input
            icon={<Search size={18} />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên chức vụ..."
          />
        </div>

        {/* Select Phòng ban */}
        <div className="w-full sm:w-80">
          <Select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)} options={departmentOptions} />
        </div>
      </div>
    </div>
  )
}

export default React.memo(PositionsFilter)
