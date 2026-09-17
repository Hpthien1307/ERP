import { Eye, FileText, XCircle } from "lucide-react"
import { Spinner } from "../ui/spinner"
import { TABLE_COLUMNS, type RequestItem, type RequestStatus, type RequestType } from "@/types/requestType"
import Pagination from "../pagination/pagination"

type MyRequestTableProps = {
  isPending: boolean
  error: Error | null
  items: RequestItem[]
  renderTypeBadge: (type: RequestType) => React.ReactNode
  renderStatusBadge: (status: RequestStatus) => React.ReactNode
  onViewDetail: (item: RequestItem | null) => void
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

const MyRequestTable = ({ isPending, error, items, renderTypeBadge, renderStatusBadge, onViewDetail, page, pageCount, onPageChange }: MyRequestTableProps) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold text-2xl">
              {TABLE_COLUMNS.map(item => (
                <th className="py-4.5 px-6" key={item.value}>
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="relative divide-y min-h-80 divide-slate-100 text-2xl text-slate-700">
            {isPending && (
              <tr className="absolute top-1/2 left-1/2 -translate-1/2">
                <td colSpan={6} className="py-16 text-center">
                  <Spinner className="size-16" />
                </td>
              </tr>
            )}

            {!isPending && error && (
              <tr>
                <td colSpan={6} className="py-16 text-center text-rose-400 text-2xl font-medium">
                  <XCircle size={40} className="mx-auto text-rose-300 mb-3" />
                  {error.message || "Không thể tải dữ liệu. Vui lòng thử lại sau."}
                </td>
              </tr>
            )}

            {items && items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400 text-2xl font-medium">
                  <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                  Không tìm thấy đơn nào của bạn
                </td>
              </tr>
            )}

            {items?.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-5 px-6 font-medium">
                  <div className="flex flex-col gap-y-1.5 items-start">
                    {renderTypeBadge(item.type)}
                    <span className="text-slate-400 text-xl">#{item.id}</span>
                  </div>
                </td>

                <td className="py-5 px-6">
                  <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-2 text-slate-800 font-medium">
                      <span className="text-2xl">
                        {new Date(item.startDate).toLocaleDateString("vi-VN")}
                        {item.startDate !== item.endDate && ` - ${new Date(item.endDate).toLocaleDateString("vi-VN")}`}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-5 px-6 max-w-xs">
                  <p className="line-clamp-2 text-slate-700 font-normal leading-relaxed">{item.reason}</p>
                </td>

                <td className="py-5 px-6">{renderStatusBadge(item.status)}</td>

                <td className="py-5 px-6">
                  <span className="font-medium text-2xl text-slate-700">{item.reviewer?.fullName || "Chưa có"}</span>
                </td>

                <td className="py-5 px-6 text-center">
                  <button
                    type="button"
                    onClick={() => onViewDetail(item)}
                    className="inline-flex items-center justify-center p-2.5 rounded-2xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Xem chi tiết đơn"
                  >
                    <Eye size={18} />
                  </button>
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

export default MyRequestTable
