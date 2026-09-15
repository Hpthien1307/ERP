import { Clock, LogIn, LogOut, CalendarDays, TrendingUp, AlertCircle, CheckCircle2, XCircle, Search, Filter, Timer, CalendarClock } from "lucide-react"
import Btn from "@/components/ui/button"
import Input from "@/components/ui/input"
import Select from "@/components/ui/select"
import useFetch from "@/hooks/useFetch"
import type { AttItem } from "@/types/attendanceType"
import { useEffect, useState } from "react"
import UseDebounce from "@/hooks/useDebounce"

const Attendance = () => {
  const {
    data: attData,
    isPending: attLoading,
    isError: attError
  } = useFetch<{ message: string; data: AttItem[] }>({
    url: "attendance/me",
    key: ["Get_My_Attendance"]
  })

  useEffect(() => {
    console.log("att data", attData)
  }, [attData])

  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState("ALL")
  const [selectedStatus, setSelectedStatus] = useState("ALL")
  const searchDebounce = UseDebounce(search, 500)

  // State Modal tạo đơn mới
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<AttItem | null>(null)

  const stats = {
    total: attData?.data?.length || 0,
    checkIn: attData?.data?.filter(r => r.checkIn !== null).length || 0,
    checkOut: attData?.data?.filter(r => r.checkOut !== null).length || 0,
    date: attData?.data?.filter(r => r.date !== null).length || null,
    workHours: attData?.data?.filter(r => r.workingHours !== null).reduce((acc, r) => acc + r.workingHours, 0) || 0
  }

  return (
    <div className="max-w-full mx-auto flex flex-col gap-y-8 pb-16">
      {/* 1. HEADER TRANG */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-x-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Clock size={26} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Chấm công</h1>
            <p className="text-slate-500 text-2xl font-normal mt-2">Theo dõi giờ vào/ra và lịch sử chấm công hằng ngày của bạn</p>
          </div>
        </div>
      </div>

      {/* 2. HERO — CHẤM CÔNG HÔM NAY */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 shadow-lg shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Đồng hồ + ngày */}
          <div className="flex flex-col gap-y-2">
            <span className="text-blue-100 text-2xl font-medium">Chủ Nhật, 13/09/2026</span>
            <span className="text-white text-6xl sm:text-7xl font-bold tracking-tight tabular-nums">08:42:15</span>
          </div>

          {/* Trạng thái + nút chấm công */}
          <div className="flex flex-col gap-y-4 items-start lg:items-end">
            <div className="flex items-center gap-x-6">
              <div className="flex flex-col items-start lg:items-end">
                <span className="text-blue-100 text-3xl">Giờ vào</span>
                <span className="text-white text-5xl font-bold">08:00</span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="flex flex-col items-start lg:items-end">
                <span className="text-blue-100 text-3xl">Giờ ra</span>
                <span className="text-white text-5xl font-bold">0:0</span>
              </div>
            </div>

            <Btn
              text="Chấm công ra"
              variant="default"
              size="default"
              classCustom="bg-white text-blue-700 hover:bg-blue-50 text-xl shadow-md"
              buttonProps={{ type: "button" }}
            >
              <LogOut size={18} />
            </Btn>
          </div>
        </div>
      </div>

      {/* 3. STATS CARDS THÁNG NÀY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={26} />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-xl font-medium">Ngày đúng giờ</span>
            <span className="text-3xl font-bold text-emerald-600">18</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle size={26} />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-xl font-medium">Ngày đi trễ</span>
            <span className="text-3xl font-bold text-amber-600">3</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle size={26} />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-xl font-medium">Ngày vắng mặt</span>
            <span className="text-3xl font-bold text-rose-600">1</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <TrendingUp size={26} />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-xl font-medium">Giờ làm TB/ngày</span>
            <span className="text-3xl font-bold text-slate-900">8.4h</span>
          </div>
        </div>
      </div>

      {/* 4. BỘ LỌC LỊCH SỬ CHẤM CÔNG */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-x-2.5 shrink-0">
          <CalendarClock size={20} className="text-slate-400" />
          <h3 className="text-2xl font-bold text-slate-900">Lịch sử chấm công</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full sm:w-72">
            <Input placeholder="Tìm theo ngày..." icon={<Search size={18} />} />
          </div>
          <div className="w-full sm:w-64">
            <Select
              icon={<Filter size={18} />}
              options={[
                { value: "ALL", label: "Tất cả trạng thái" },
                { value: "ON_TIME", label: "Đúng giờ" },
                { value: "LATE", label: "Đi trễ" },
                { value: "ABSENT", label: "Vắng mặt" },
                { value: "LEAVE", label: "Nghỉ phép" }
              ]}
            />
          </div>
        </div>
      </div>

      {/* 5. BẢNG LỊCH SỬ */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold text-2xl">
                <th className="py-4.5 px-6">Ngày</th>
                <th className="py-4.5 px-6">Giờ vào</th>
                <th className="py-4.5 px-6">Giờ ra</th>
                <th className="py-4.5 px-6">Tổng giờ</th>
                <th className="py-4.5 px-6">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-2xl text-slate-700">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-5 px-6 font-medium text-slate-800">Thứ 7, 12/09/2026</td>
                <td className="py-5 px-6">
                  <span className="flex items-center gap-x-1.5">
                    <LogIn size={16} className="text-slate-400" />
                    08:02
                  </span>
                </td>
                <td className="py-5 px-6">
                  <span className="flex items-center gap-x-1.5">
                    <LogOut size={16} className="text-slate-400" />
                    17:35
                  </span>
                </td>
                <td className="py-5 px-6">
                  <span className="flex items-center gap-x-1.5 font-medium text-slate-800">
                    <Timer size={16} className="text-slate-400" />
                    8.6h
                  </span>
                </td>
                <td className="py-5 px-6">
                  <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-xl font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CheckCircle2 size={15} />
                    Đúng giờ
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-5 px-6 font-medium text-slate-800">Thứ 6, 11/09/2026</td>
                <td className="py-5 px-6">
                  <span className="flex items-center gap-x-1.5">
                    <LogIn size={16} className="text-slate-400" />
                    08:24
                  </span>
                </td>
                <td className="py-5 px-6">
                  <span className="flex items-center gap-x-1.5">
                    <LogOut size={16} className="text-slate-400" />
                    17:30
                  </span>
                </td>
                <td className="py-5 px-6">
                  <span className="flex items-center gap-x-1.5 font-medium text-slate-800">
                    <Timer size={16} className="text-slate-400" />
                    8.1h
                  </span>
                </td>
                <td className="py-5 px-6">
                  <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-xl font-semibold border bg-amber-50 text-amber-700 border-amber-200">
                    <AlertCircle size={15} />
                    Đi trễ
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-5 px-6 font-medium text-slate-800">Thứ 5, 10/09/2026</td>
                <td className="py-5 px-6">
                  <span className="flex items-center gap-x-1.5">
                    <LogIn size={16} className="text-slate-400" />
                    08:00
                  </span>
                </td>
                <td className="py-5 px-6">
                  <span className="flex items-center gap-x-1.5">
                    <LogOut size={16} className="text-slate-400" />
                    17:31
                  </span>
                </td>
                <td className="py-5 px-6">
                  <span className="flex items-center gap-x-1.5 font-medium text-slate-800">
                    <Timer size={16} className="text-slate-400" />
                    8.5h
                  </span>
                </td>
                <td className="py-5 px-6">
                  <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-xl font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CheckCircle2 size={15} />
                    Đúng giờ
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-5 px-6 font-medium text-slate-800">Thứ 4, 09/09/2026</td>
                <td className="py-5 px-6">
                  <span className="text-slate-400 italic text-xl">--:--</span>
                </td>
                <td className="py-5 px-6">
                  <span className="text-slate-400 italic text-xl">--:--</span>
                </td>
                <td className="py-5 px-6">
                  <span className="text-slate-400 italic text-xl">—</span>
                </td>
                <td className="py-5 px-6">
                  <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-xl font-semibold border bg-sky-50 text-sky-700 border-sky-200">
                    <CalendarDays size={15} />
                    Nghỉ phép
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-5 px-6 font-medium text-slate-800">Thứ 2, 07/09/2026</td>
                <td className="py-5 px-6">
                  <span className="text-slate-400 italic text-xl">--:--</span>
                </td>
                <td className="py-5 px-6">
                  <span className="text-slate-400 italic text-xl">--:--</span>
                </td>
                <td className="py-5 px-6">
                  <span className="text-slate-400 italic text-xl">—</span>
                </td>
                <td className="py-5 px-6">
                  <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-xl font-semibold border bg-rose-50 text-rose-700 border-rose-200">
                    <XCircle size={15} />
                    Vắng mặt
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Attendance
