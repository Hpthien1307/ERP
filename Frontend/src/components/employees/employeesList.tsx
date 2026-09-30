import Pagination from "../pagination/pagination"
import { Eye, FileText, Trash2 } from "lucide-react"
import { TABLE_COLUMNS_EMPLOYEES } from "@/types/employeesType"
import { formatSliceId } from "@/utils/formatters"
import { Spinner } from "../ui/spinner"
import type { UserState } from "@/types/globalType"
import { getErrorMessage } from "@/utils/error"
import React from "react"

type EmployeesListProps = {
  data: UserState[]
  loading: boolean
  error: Error | null
  pageCount: number
  page: number
  onPageChange: (page: number) => void
  onEdit: (employee: UserState) => void
  onRemove: (id: string) => void
}

const renderRoleBadge = (role: string) => {
  switch (role) {
    case "ADMIN":
      return (
        <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full text-xl font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          Quản trị
        </span>
      )
    case "MANAGER":
      return (
        <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full text-xl font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          Quản lí
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full text-xl font-semibold bg-blue-50 text-blue-600">
          Nhân viên
        </span>
      )
  }
}

const EmployeesList = ({ data, loading, error, onPageChange, page, pageCount, onEdit, onRemove }: EmployeesListProps) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="relative w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold text-2xl">
              {TABLE_COLUMNS_EMPLOYEES.map(column => (
                <th key={column.value} className="py-4 px-6">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="relative divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={7} className="py-20">
                  <Spinner className="size-16 mx-auto" />
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={7} className="py-16 text-center text-rose-400 text-2xl font-medium">
                  {getErrorMessage(error)}
                </td>
              </tr>
            )}

            {!loading && !error && data.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-400 text-2xl font-medium">
                  <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                  Không tìm thấy công việc nào phù hợp.
                </td>
              </tr>
            )}
            {data?.map(employee => (
              <tr key={employee.id} className="hover:bg-slate-50/60 transition-colors">
                {/* ID nhân viên */}
                <td className="py-5 px-6 max-w-md">
                  <span
                    className="font-mono text-lg font-bold px-2.5 py-0.5 rounded-lg bg-slate-100
                   text-slate-700 border border-slate-200"
                  >
                    #{formatSliceId({ id: employee.id })}
                  </span>
                </td>

                {/* Họ và tên */}
                <td className="py-5 px-6">
                  <span className="inline-flex items-center text-2xl">{employee.fullName}</span>
                </td>

                {/* Email */}
                <td className="py-5 px-6">
                  <span className="text-2xl text-slate-800">{employee?.email}</span>
                </td>

                {/* Số điện thoại */}
                <td className="py-5 px-6 whitespace-nowrap">{employee.phone}</td>

                {/* Chức vụ */}
                <td className="py-5 px-6 whitespace-nowrap">{renderRoleBadge(employee?.role)}</td>

                {/* Phòng ban */}
                <td className="py-5 px-6 whitespace-nowrap">
                  <span className="text-2xl text-slate-800">{employee?.department?.title}</span>
                </td>

                {/* Vị trí */}
                <td className="py-5 px-6 whitespace-nowrap">
                  <span className="text-2xl text-slate-800">{employee?.position?.title}</span>
                </td>

                {/* Hành động */}
                <td className="py-5 px-6 text-center whitespace-nowrap">
                  <div className="inline-flex items-center gap-x-1">
                    <button
                      type="button"
                      title="Xem chi tiết"
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                      onClick={() => onEdit?.(employee)}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      type="button"
                      title="Xóa"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      onClick={() => onRemove?.(employee.id)}
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
      {pageCount > 1 && (
        <div className="px-6 py-5 border-t border-slate-100">
          <Pagination currentPage={page} totalPages={pageCount} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  )
}

export default React.memo(EmployeesList)
