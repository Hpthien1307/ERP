import type { PaginationType } from "./globalType"

export type AttendanceItem = {
  id: string
  userId: string
  date: string
  checkIn: string
  checkOut: string | null
  workingHours: number | null
  status: string
  createdAt: string
}

export type AttendanceStats = {
  onTime: number
  late: number
  absent: number
  avgWorkingHours: string
}

export type TodayAttendanceResponse = {
  message: string
  data: AttendanceItem | null
}

export type AttendanceListResponse = {
  message: string
  data: AttendanceItem[]
  pagination: PaginationType
}

export type AttendanceStatsResponse = {
  message: string
  data: AttendanceStats
}

export type AttendanceFilterType = "ALL" | "ON_TIME" | "LATE" | "ABSENT" | "LEAVE"

export const TABLE_ATT_COLUMN = [
  {
    value: "DATE",
    label: "Ngày"
  },
  {
    value: "CHECKIN",
    label: "Giờ vào"
  },
  {
    value: "CHECKOUT",
    label: "Giờ ra"
  },
  {
    value: "WORKTIME",
    label: "Tổng giờ làm"
  },
  {
    value: "STATUS",
    label: "Trạng thái"
  }
]

export const SELECT_ATT_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: "ON_TIME", label: "Đúng giờ" },
  { value: "LATE", label: "Đi trễ" },
  { value: "ABSENT", label: "Vắng mặt" },
  { value: "LEAVE", label: "Nghỉ phép" }
]
