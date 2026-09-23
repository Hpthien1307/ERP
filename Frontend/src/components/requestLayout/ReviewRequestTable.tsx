import { CheckCircle, FileText, XCircle } from "lucide-react"
import { Spinner } from "../ui/spinner"
import type { RequestItem, RequestType } from "@/types/requestType"
import Pagination from "../pagination/pagination"
import { getErrorMessage } from "@/utils/error"

type ReviewRequestTableProps = {
  isPending: boolean
  error: Error | null
  items: RequestItem[]
  isReviewing: boolean
  onApprove: (id: string) => void
  onReject: (item: RequestItem) => void
  renderTypeBadge: (type: RequestType) => React.ReactNode
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

const ReviewRequestTable = ({
  isPending,
  error,
  items,
  isReviewing,
  onApprove,
  onReject,
  renderTypeBadge,
  page,
  pageCount,
  onPageChange
}: ReviewRequestTableProps) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold text-2xl">
              <th className="py-4.5 px-6">Loại đơn</th>
              <th className="py-4.5 px-6">Nhân viên</th>
              <th className="py-4.5 px-6">Thời gian</th>
              <th className="py-4.5 px-6">Lý do</th>
              <th className="py-4.5 px-6 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="relative divide-y divide-slate-100 text-2xl text-slate-700">
            {isPending && (
              <tr>
                <td colSpan={5} className="py-20">
                  <Spinner className="size-16 mx-auto" />
                </td>
              </tr>
            )}

            {!isPending && error && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-rose-400 text-2xl font-medium">
                  {getErrorMessage(error)}
                </td>
              </tr>
            )}

            {!isPending && !error && items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400 text-2xl font-medium">
                  <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                  Không có đơn nào cần duyệt.
                </td>
              </tr>
            )}

            {items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-5 px-6">{renderTypeBadge(item.type)}</td>
                <td className="py-5 px-6 font-medium">{item.user?.fullName ?? "—"}</td>
                <td className="py-5 px-6">
                  {new Date(item.startDate).toLocaleDateString("vi-VN")}
                  {item.startDate !== item.endDate && ` - ${new Date(item.endDate).toLocaleDateString("vi-VN")}`}
                </td>
                <td className="py-5 px-6 max-w-xs">
                  <p className="line-clamp-2">{item.reason}</p>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center justify-center gap-x-2">
                    <button
                      type="button"
                      disabled={isReviewing}
                      onClick={() => onApprove(item.id)}
                      className="inline-flex items-center gap-x-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle size={16} />
                      Duyệt
                    </button>
                    <button
                      type="button"
                      disabled={isReviewing}
                      onClick={() => onReject(item)}
                      className="inline-flex items-center gap-x-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      Từ chối
                    </button>
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

export default ReviewRequestTable
