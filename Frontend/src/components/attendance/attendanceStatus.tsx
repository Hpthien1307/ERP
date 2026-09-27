import ClockDisplay from "./clockDisplay"
import Btn from "../ui/button"
import { LogIn, LogOut } from "lucide-react"
import { useTodayAttendance, useCheckIn, useCheckOut } from "@/hooks/useAttendance"

const AttendanceStatus = () => {
  const { data: todayData } = useTodayAttendance()

  const { mutate: checkIn } = useCheckIn()
  const { mutate: checkOut } = useCheckOut()

  const todayAttendance = todayData?.data ?? null
  const hasCheckedIn = !!todayAttendance
  const hasCheckedOut = !!todayAttendance?.checkOut

  return (
    <div className="bg-linear-to-br from-blue-600 via-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 shadow-lg shadow-blue-500/20 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-white/5" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Đồng hồ + ngày */}
        <ClockDisplay />

        {/* Trạng thái + nút chấm công */}
        <div className="flex flex-col gap-y-4 items-start lg:items-end">
          <div className="flex items-center gap-x-6">
            <div className="flex flex-col items-start lg:items-end">
              <span className="text-blue-100 text-3xl">Giờ vào</span>
              <span className="text-white text-5xl font-bold">
                {hasCheckedIn ? new Date(todayAttendance!.checkIn).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
              </span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="flex flex-col items-start lg:items-end">
              <span className="text-blue-100 text-3xl">Giờ ra</span>
              <span className="text-white text-5xl font-bold">
                {hasCheckedOut && todayAttendance?.checkOut
                  ? new Date(todayAttendance.checkOut).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  : "--:--"}{" "}
              </span>
            </div>
          </div>
          {!hasCheckedIn && (
            <Btn
              text="Chấm công vào"
              variant="default"
              size="default"
              classCustom="bg-white text-blue-700 hover:bg-blue-50 text-xl shadow-md"
              buttonProps={{ type: "button", onClick: () => checkIn() }}
            >
              <LogIn size={18} />
            </Btn>
          )}
          {hasCheckedIn && !hasCheckedOut && (
            <Btn
              text="Chấm công ra"
              variant="default"
              size="default"
              classCustom="bg-white text-blue-700 hover:bg-blue-50 text-xl shadow-md"
              buttonProps={{ type: "button", onClick: () => checkOut() }}
            >
              <LogOut size={18} />
            </Btn>
          )}
          {hasCheckedIn && hasCheckedOut && <span className="text-white text-5xl font-bold">Bạn đã chấm công</span>}
        </div>
      </div>
    </div>
  )
}

export default AttendanceStatus
