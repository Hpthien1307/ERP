import { FolderKanban, Plus } from "lucide-react"
import Btn from "../ui/button"

type PositionsHeaderProps = {
  setCreateModal: (createModal: boolean) => void
}

const PositionsHeader = ({ setCreateModal }: PositionsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-x-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <FolderKanban size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Quản lý Chức vụ</h1>
        </div>
      </div>
      <div className="flex items-center gap-x-3">
        <Btn
          text="Tạo chức vụ mới"
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

export default PositionsHeader
