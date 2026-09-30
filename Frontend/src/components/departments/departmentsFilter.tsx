import { Filter, Search } from "lucide-react"
import Input from "../ui/input"
import React from "react"

type DepartmentsFilterProps = {
  search: string
  setSearch: (search: string) => void
}

const DepartmentsFilter = ({ search, setSearch }: DepartmentsFilterProps) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-x-2 text-slate-800 font-semibold text-2xl">
          <Filter size={18} className="text-blue-600" />
          <span>Bộ lọc phòng ban</span>
        </div>
      </div>

      <div className="flex items-center flex-col sm:flex-row gap-4">
        <div className="flex-1 w-full">
          <Input
            icon={<Search size={18} />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên phòng ban..."
          />
        </div>
      </div>
    </div>
  )
}

export default React.memo(DepartmentsFilter)
