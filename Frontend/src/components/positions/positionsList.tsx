import Pagination from "../pagination/pagination"
import { Eye, FileText, Trash2, Users } from "lucide-react"
import { formatSliceId } from "@/utils/formatters"
import { Spinner } from "../ui/spinner"
import type { PositionItem } from "@/types/positionType"
import { getErrorMessage } from "@/utils/error"
import React from "react"

type PositionsListProps = {
  data: PositionItem[]
  loading: boolean
  error: Error | null
  pageCount?: number
  page?: number
  onPageChange?: (page: number) => void
  onEdit: (position: PositionItem) => void
  onRemove: (id: string) => void
}

const TABLE_COLUMNS_POSITIONS = [
  { label: "Mã vị trí", value: "id" },
  { label: "Tên vị trí / Chức vụ", value: "title" },
  { label: "Phòng ban", value: "department" },
  { label: "Số lượng nhân sự", value: "usersCount" },
  { label: "Hành động", value: "action" }
]

const PositionsList = ({
  data,
  loading,
  error,
  onPageChange,
  page = 1,
  pageCount = 0,
  onEdit,
  onRemove
}: PositionsListProps) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="relative w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold text-2xl">
              {TABLE_COLUMNS_POSITIONS.map(column => (
                <th key={column.value} className={`py-4 px-6 ${column.value === "action" ? "text-center" : ""}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="relative divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={5} className="py-20">
                  <Spinner className="size-16 mx-auto" />
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-rose-400 text-2xl font-medium">
                  {getErrorMessage(error)}
                </td>
              </tr>
            )}

            {!loading && !error && data.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-slate-400 text-2xl font-medium">
                  <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                  Không tìm thấy vị trí / chức vụ nào phù hợp.
                </td>
              </tr>
            )}
            {data?.map(position => (
              <tr key={position.id} className="hover:bg-slate-50/60 transition-colors">
                {/* ID vị trí */}
                <td className="py-5 px-6 max-w-md">
                  <span
                    className="font-mono text-lg font-bold px-2.5 py-0.5 rounded-lg bg-slate-100
                   text-slate-700 border border-slate-200"
                  >
                    #{formatSliceId({ id: position.id })}
                  </span>
                </td>

                {/* Tên vị trí */}
                <td className="py-5 px-6 font-semibold text-2xl text-slate-900">
                  {position.title}
                </td>

                {/* Phòng ban */}
                <td className="py-5 px-6 whitespace-nowrap">
                  {position.department?.title ? (
                    <span className="text-2xl font-medium text-slate-800 bg-blue-50/80 text-blue-700 px-3 py-1 rounded-full border border-blue-100 inline-flex items-center gap-x-1.5">
                      {position.department.title}
                    </span>
                  ) : (
                    <span className="text-xl text-slate-400 italic">Chưa gắn phòng ban</span>
                  )}
                </td>

                {/* Số lượng nhân sự */}
                <td className="py-5 px-6 whitespace-nowrap">
                  <span className="inline-flex items-center gap-x-2 text-2xl text-slate-700 font-semibold bg-slate-100/80 px-3 py-1 rounded-xl">
                    <Users size={18} className="text-slate-500" />
                    {position.users?.length ?? 0} thành viên
                  </span>
                </td>

                {/* Hành động */}
                <td className="py-5 px-6 text-center whitespace-nowrap">
                  <div className="inline-flex items-center gap-x-1">
                    <button
                      type="button"
                      title="Xem / Chỉnh sửa"
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                      onClick={() => onEdit?.(position)}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      type="button"
                      title="Xóa"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      onClick={() => onRemove?.(position.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && onPageChange && (
        <div className="px-6 py-5 border-t border-slate-100">
          <Pagination currentPage={page} totalPages={pageCount} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  )
}

export default React.memo(PositionsList)
