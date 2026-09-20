import { TABLE_COLUMNS_TASK, type TaskItem } from "@/types/taskType"
import { Calendar, Eye, FileText, Trash2 } from "lucide-react"
import { Spinner } from "../ui/spinner"
import Pagination from "../pagination/pagination"
import { FormatDate, formatSliceId } from "@/utils/formatters"
import { TASK_TYPE_OPTIONS } from "@/types/taskType"

type TaskListProps = {
  isManager: boolean
  data: TaskItem[]
  loading: boolean
  error: Error | null
  pageCount: number
  page: number
  onPageChange: (page: number) => void
  onUpdateStatus?: (id: string, status: string) => void
  onRemove: (id: string) => void
  onEditTask?: (task: TaskItem) => void
}

const TaskList = ({ isManager, data = [], loading, error, pageCount, page, onPageChange, onRemove, onEditTask }: TaskListProps) => {
  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full text-xl font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Ưu tiên cao
          </span>
        )
      case "MEDIUM":
        return (
          <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full text-xl font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Trung bình
          </span>
        )
      default:
        return <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full text-xl font-semibold bg-blue-50 text-blue-600">Bình thường</span>
    }
  }

  const renderStatusBadge = (task: TaskItem) => {
    switch (task?.status) {
      case "TODO":
        return (
          <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full text-xl font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Cần làm
          </span>
        )
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full text-xl font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            Đang thực hiện
          </span>
        )
      case "IN_REVIEW":
        return (
          <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full text-xl font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Đang duyệt
          </span>
        )
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full text-xl font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Đã hoàn thành
          </span>
        )
    }

    // const statusClass = (() => {
    //   switch (task?.status) {
    //     case "TODO":
    //       return "bg-blue-50 text-blue-600 border-blue-200"
    //     case "IN_PROGRESS":
    //       return "bg-sky-50 text-sky-700 border-sky-200"
    //     case "IN_REVIEW":
    //       return "bg-indigo-50 text-indigo-700 border-indigo-200"
    //     case "COMPLETED":
    //       return "bg-emerald-50 text-emerald-700 border-emerald-200"
    //     default:
    //       return "bg-slate-50 text-slate-600 border-slate-200"
    //   }
    // })()

    // return (
    //   <select
    //     value={task?.status}
    //     onChange={e => onUpdateStatus?.(task.id, e.target.value)}
    //     className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-center text-xl font-semibold border cursor-pointer outline-none transition-colors ${statusClass}`}
    //   >
    //     <option value="TODO" className="bg-white text-slate-800">
    //       Cần làm
    //     </option>
    //     <option value="IN_PROGRESS" className="bg-white text-slate-800">
    //       Đang thực hiện
    //     </option>
    //     <option value="IN_REVIEW" className="bg-white text-slate-800">
    //       Đang duyệt
    //     </option>
    //     <option value="COMPLETED" className="bg-white text-slate-800">
    //       Đã hoàn thành
    //     </option>
    //   </select>
    // )
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="relative w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold text-2xl">
              {TABLE_COLUMNS_TASK.map(column => (
                <th key={column.value} className="py-4 px-6">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr className="absolute top-1/2 left-1/2 -translate-1/2">
                <td colSpan={5} className="py-16 text-center">
                  <Spinner className="size-16" />
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-rose-400 text-2xl font-medium">
                  {error.message || "Không thể tải dữ liệu."}
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-400 text-2xl font-medium">
                  <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                  Không tìm thấy công việc nào phù hợp.
                </td>
              </tr>
            )}
            {data?.map(task => (
              <tr key={task.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Mã & Tiêu đề */}
                <td className="py-5 px-6 max-w-md">
                  <span
                    className="font-mono text-lg font-bold px-2.5 py-0.5 rounded-lg bg-slate-100
                   text-slate-700 border border-slate-200"
                  >
                    {formatSliceId({ id: task.id })}
                  </span>
                </td>

                {/* Tiêu đề */}
                <td className="py-5 px-6">
                  <span className="inline-flex items-center text-2xl font-medium">{task.title}</span>
                </td>

                {/* Người phụ trách */}
                <td className="py-5 px-6">
                  <div className="flex items-center gap-x-3">
                    <div className="flex flex-col">
                      <span className="text-2xl font-semibold text-slate-800">{task?.assignee?.fullName}</span>
                    </div>
                  </div>
                </td>

                {/* Độ ưu tiên */}
                <td className="py-5 px-6 whitespace-nowrap">{renderPriorityBadge(task?.priority)}</td>

                {/* Hạn chót */}
                <td className="py-5 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-x-2 text-slate-800 text-2xl font-medium">
                    <Calendar size={20} className="text-slate-400" />
                    <span>{FormatDate(task?.dueDate)}</span>
                  </div>
                </td>

                {/* Trạng thái */}
                <td className="py-5 px-6 whitespace-nowrap">{renderStatusBadge(task)}</td>

                {/* Hành động */}
                <td className="py-5 px-6 text-center whitespace-nowrap">
                  <div className="inline-flex items-center gap-x-1">
                    <button
                      type="button"
                      title="Xem chi tiết"
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                      onClick={() => onEditTask?.(task)}
                    >
                      <Eye size={18} />
                    </button>
                    {isManager && task.status !== "COMPLETED" && (
                      <button
                        type="button"
                        title="Xóa"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        onClick={() => onRemove(task.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <div className="px-6 py-5 border-t border-slate-100">
          <Pagination currentPage={page} totalPages={pageCount} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  )
}

export default TaskList
