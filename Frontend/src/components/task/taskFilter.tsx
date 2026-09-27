import { Filter, Search } from "lucide-react"
import Input from "../ui/input"
import Select from "../ui/select"
import Btn from "../ui/button"
import { TASK_PRIORITY_OPTIONS, TASK_TYPE_OPTIONS } from "@/types/taskType"

const NOW = new Date()
const CURRENT_YEAR = NOW.getFullYear()
const CURRENT_MONTH = NOW.getMonth() + 1 // 1-based

// Max = năm hiện tại, lùi tối đa 2 năm
const YEAR_OPTIONS = Array.from({ length: 3 }, (_, i) => {
  const year = CURRENT_YEAR - 2 + i
  return { value: String(year), label: `Năm ${year}` }
})

type TaskFilterProps = {
  isMyTask: boolean
  handleMyTask: () => void
  month: string
  year: string
  search: string
  selectedStatus: string
  selectedPriority: string
  selectedCreator: string
  myMember: { value: string; label: string }[]
  setSearch: (search: string) => void
  setSelectedStatus: (selectedStatus: string) => void
  setSelectedPriority: (selectedPriority: string) => void
  setSelectedCreator: (selectedCreator: string) => void
  setMonth: (month: string) => void
  setYear: (year: string) => void
}

const TaskFilter = ({
  isMyTask,
  handleMyTask,
  month,
  year,
  search,
  selectedStatus,
  selectedPriority,
  selectedCreator,
  myMember,
  setSearch,
  setSelectedStatus,
  setSelectedPriority,
  setSelectedCreator,
  setMonth,
  setYear
}: TaskFilterProps) => {
  // Nếu đang chọn năm hiện tại → chỉ hiển thị tới tháng hiện tại
  const monthOptions = Array.from({ length: Number(year) === CURRENT_YEAR ? CURRENT_MONTH : 12 }, (_, i) => ({ value: String(i + 1), label: `Tháng ${i + 1}` }))

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-x-2 text-slate-800 font-semibold text-2xl">
          <Filter size={18} className="text-blue-600" />
          <span>Bộ lọc công việc</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Input Tìm kiếm */}
        <div className="flex items-center flex-col sm:flex-row gap-4">
          <div className="flex-1 w-full">
            <Input icon={<Search size={18} />} value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tiêu đề, tên người phụ trách" />
          </div>
          <Btn
            text={isMyTask ? "Xem tất cả công việc" : "Công việc của tôi"}
            variant={"primary"}
            size="default"
            buttonProps={{
              onClick: handleMyTask
            }}
          />
        </div>

        <div className="flex items-center flex-col sm:flex-row gap-4">
          {/* Select Tháng */}
          <div className="w-full flex-1">
            <Select value={month} onChange={e => setMonth(e.target.value)} options={monthOptions} />
          </div>

          {/* Select Năm */}
          <div className="w-full flex-1">
            <Select value={year} onChange={e => setYear(e.target.value)} options={YEAR_OPTIONS} />
          </div>

          {/* Select Trạng thái */}
          <div className="w-full flex-1">
            <Select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} options={TASK_TYPE_OPTIONS} />
          </div>

          {/* Select Mức độ ưu tiên */}
          <div className="w-full flex-1">
            <Select value={selectedPriority} onChange={e => setSelectedPriority(e.target.value)} options={TASK_PRIORITY_OPTIONS} />
          </div>

          {/* Select Người phụ trách */}
          <div className="w-full flex-1">
            <Select value={selectedCreator} onChange={e => setSelectedCreator(e.target.value)} disabled={isMyTask} options={myMember} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskFilter
