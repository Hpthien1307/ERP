import { ArrowLeft, ArrowRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  const getVisiblePages = (): (number | "ellipsis")[] => {
    const delta = 1
    const range: (number | "ellipsis")[] = []
    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

    range.push(1)

    if (rangeStart > 2) range.push("ellipsis")

    for (let i = rangeStart; i <= rangeEnd; i++) {
      range.push(i)
    }

    if (rangeEnd < totalPages - 1) range.push("ellipsis")

    if (totalPages > 1) range.push(totalPages)

    return range
  }

  const pages = getVisiblePages()

  return (
    <div className="pagi-nav w-full">
      <nav className="flex items-center justify-center gap-x-2.5">
        {/* Nút Quay lại */}
        <button
          type="button"
          className={`${
            currentPage === 1 ? "invisible" : ""
          } flex items-center justify-center w-14 h-14 rounded-xl border border-slate-200/80 text-slate-500 bg-white shadow-xs transition-all duration-150 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40 disabled:pointer-events-none`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ArrowLeft size={20} />
        </button>

        {/* Danh sách số trang */}
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="w-14 h-14 flex items-center justify-center text-md font-medium text-slate-400 select-none">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`w-14 h-14 flex items-center justify-center rounded-xl font-semibold text-md transition-all duration-150 border ${
                page === currentPage
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "bg-white border-slate-200/80 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}

        {/* Nút Tiếp theo */}
        <button
          type="button"
          className={`${
            currentPage === totalPages ? "invisible" : ""
          } flex items-center justify-center w-14 h-14 rounded-xl border border-slate-200/80 text-slate-500 bg-white shadow-xs transition-all duration-150 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40 disabled:pointer-events-none`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ArrowRight size={20} />
        </button>
      </nav>
    </div>
  )
}

export default Pagination
