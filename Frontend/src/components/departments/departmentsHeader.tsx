import { Plus, Users } from "lucide-react"
import Btn from "../ui/button"

type DepartmentsHeaderProps = {
  setCreateModal: (createModal: boolean) => void
}

const DepartmentsHeader = ({ setCreateModal }: DepartmentsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-x-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Quản lý Phòng ban</h1>
        </div>
      </div>
      <div className="flex items-center gap-x-3">
        <Btn
          text="Thêm phòng ban mới"
          variant="primary"
          size="default"
          classCustom="shadow-md shadow-blue-500/20 text-xl"
          buttonProps={{
            type: "button",
            onClick: () => setCreateModal(true)
          }}
        >
          <Plus size={18} />
        </Btn>
      </div>
    </div>
  )
}

export default DepartmentsHeader
