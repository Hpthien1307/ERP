import { useEffect, useState } from "react"
import type { AttendanceListResponse } from "@/types/attendanceType"
import { getTodayDateString } from "@/utils/formatters"

// component
import AttendanceHeader from "@/components/attendance/attendanceHeader"
import AttendanceStatus from "@/components/attendance/attendanceStatus"
import AttendanceStats from "@/components/attendance/attendanceStats"
import AttendaceFilter from "@/components/attendance/attendanceFilter"
import AttendanceList from "@/components/attendance/attendanceList"
import useFetch from "@/hooks/useFetch"
import { type AttendanceFilterType } from "@/types/attendanceType"

const Attendance = () => {
  const [filterDate, setFilterDate] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<AttendanceFilterType>("ALL")
  const [myPage, setMyPage] = useState<number>(1)
  const PAGE_SIZE = 5

  useEffect(() => {
    setMyPage(1)
  }, [filterStatus, filterDate])

  const {
    data: historyData,
    isPending: isHistoryPending,
    isError: isHistoryError
  } = useFetch<AttendanceListResponse>({
    url: "/attendance/me",
    key: ["get_mine_attendance", myPage, filterStatus, filterDate],
    params: {
      page: myPage,
      limit: PAGE_SIZE,
      filterDate: filterDate,
      filterType: filterStatus === "ALL" ? undefined : filterStatus
    }
  })

  const historyAttendance = historyData?.data ?? []
  const historyAttendanceTotalPages = historyData?.pagination?.totalPages ?? 0

  return (
    <div className="max-w-full mx-auto flex flex-col gap-y-8 pb-16">
      {/* 1. HEADER TRANG */}
      <AttendanceHeader />

      {/* 2. HERO — CHẤM CÔNG HÔM NAY */}
      <AttendanceStatus />

      {/* 3. STATS CARDS THÁNG NÀY */}
      <AttendanceStats />

      {/* 4. BỘ LỌC LỊCH SỬ CHẤM CÔNG */}
      <AttendaceFilter
        today={getTodayDateString()}
        filterStatus={filterStatus}
        filterDate={filterDate}
        setFilterStatus={(value: string) => {
          setFilterStatus(value as AttendanceFilterType)
        }}
        setFilterDate={setFilterDate}
      />

      {/* 5. BẢNG LỊCH SỬ */}
      <AttendanceList
        data={historyAttendance}
        isLoading={isHistoryPending}
        isError={isHistoryError}
        page={myPage}
        pageCount={historyAttendanceTotalPages}
        onPageChange={setMyPage}
      />
    </div>
  )
}

export default Attendance
