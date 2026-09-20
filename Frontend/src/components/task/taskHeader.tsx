import type { UserState } from "@/types/globalType"
import { FolderKanban, Plus } from "lucide-react"
import Btn from "../ui/button"

type TaskHeaderProps = {
  user: UserState | null
  setCreateModal: (createModal: boolean) => void
}

const TaskHeader = ({ user, setCreateModal }: TaskHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-x-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <FolderKanban size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Quản lý Công việc</h1>
          <p className="text-2xl text-slate-500 font-normal mt-1">Theo dõi tiến độ, phân bổ nguồn lực và cập nhật trạng thái nhiệm vụ dự án</p>
        </div>
      </div>
      {user?.role === "MANAGER" && (
        <div className="flex items-center gap-x-3">
          <Btn
            text="Tạo công việc mới"
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
      )}
    </div>
  )
}

export default TaskHeader
