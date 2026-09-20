import { Users } from "lucide-react"
import Select from "@/components/ui/select"
import type { EmployeeOption } from "@/types/dashboardType"

type EmployeeFilterProps = {
  currentUserId: string
  employees: EmployeeOption[]
  selectedEmployeeId: string
  onChange: (id: string) => void
}

const EmployeeFilter = ({ currentUserId, employees, selectedEmployeeId, onChange }: EmployeeFilterProps) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4">
    <div className="flex items-center gap-x-2.5 shrink-0 text-slate-600">
      <Users size={20} className="text-blue-600" />
      <span className="font-semibold text-2xl">Xem theo nhân viên</span>
    </div>
    <div className="w-full sm:w-90">
      <Select
        value={selectedEmployeeId}
        onChange={e => onChange(e.target.value)}
        options={[{ value: currentUserId, label: "Tôi" }, ...employees.filter(e => e.id !== currentUserId).map(e => ({ value: e.id, label: `${e.fullName}` }))]}
      />
    </div>
  </div>
)

export default EmployeeFilter
