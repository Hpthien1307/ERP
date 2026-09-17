import { TABLE_ATT_COLUMN, type AttendanceItem } from "@/types/attendanceType"
import { Calendar, FileText, XCircle } from "lucide-react"
import { Spinner } from "../ui/spinner"
import { FormatDate, FormatDateTime } from "@/utils/formatters"
import Pagination from "../pagination/pagination"

type AttendanceListProps = {
  data: AttendanceItem[]
  isLoading: boolean
  isError: boolean
  pageCount: number
  page: number
  onPageChange: (page: number) => void
}

const AttendanceList = ({ data, isLoading, isError, page, pageCount, onPageChange }: AttendanceListProps) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold text-2xl">
              {TABLE_ATT_COLUMN.map(col => (
                <th className="py-4.5 px-6" key={col.value}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="relative divide-y divide-slate-100 text-2xl text-slate-700">
            {isLoading && (
              <tr className="absolute top-1/2 left-1/2 -translate-1/2">
                <td colSpan={5} className="py-16 text-center">
                  <Spinner className="size-16" />
                </td>
              </tr>
            )}
            {!isLoading && isError && (
              <tr>
                <td colSpan={6} className=" py-16 text-center text-rose-400 text-2xl">
                  Không thể tải dữ liệu
                </td>
              </tr>
            )}
            {!isLoading && data?.length === 0 && (
              <tr>
                <td colSpan={6} className=" py-16 text-center font-medium text-slate-400 text-2xl">
                  <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                  Không có lịch sử chấm công
                </td>
              </tr>
            )}

            {data?.map(attendance => (
              <tr className="hover:bg-slate-50/50 transition-colors" key={attendance.id}>
                <td className="py-5 px-6 font-medium text-slate-800">{FormatDate(attendance.date)}</td>
                <td className="py-5 px-6">
                  <span className="flex items-center gap-x-1.5">{attendance.checkIn ? FormatDateTime(attendance.checkIn) : "--"}</span>
                </td>
                <td className="py-5 px-6">
                  <span className="flex items-center gap-x-1.5">{attendance.checkOut ? FormatDateTime(attendance.checkOut) : "--"}</span>
                </td>
                <td className="py-5 px-6">
                  <span className="flex items-center gap-x-1.5 font-medium text-slate-800">{attendance.workingHours || "00:00"}h</span>
                </td>
                <td className="py-5 px-6">
                  {attendance.status === "ON_TIME" && (
                    <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-xl font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                      Đúng giờ
                    </span>
                  )}
                  {attendance.status === "LATE" && (
                    <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-xl font-semibold border bg-amber-50 text-amber-700 border-amber-200">
                      Đi trễ
                    </span>
                  )}
                  {attendance.status === "ABSENT" && (
                    <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-xl font-semibold border bg-rose-50 text-rose-700 border-rose-200">
                      <XCircle size={15} />
                      Vắng mặt
                    </span>
                  )}
                  {attendance.status === "LEAVE" && (
                    <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-xl font-semibold border bg-blue-50 text-blue-700 border-blue-200">
                      <Calendar size={15} />
                      Nghỉ phép
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pageCount > 1 && (
          <div className="px-6 py-5 border-t border-slate-100">
            <Pagination currentPage={page} totalPages={pageCount} onPageChange={onPageChange} />
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendanceList
