import { useCallback, useEffect, useState } from "react"
import { getTodayDateString } from "@/utils/formatters"

// component
import AttendanceHeader from "@/components/attendance/attendanceHeader"
import AttendanceStatus from "@/components/attendance/attendanceStatus"
import AttendanceStats from "@/components/attendance/attendanceStats"
import AttendaceFilter from "@/components/attendance/attendanceFilter"
import AttendanceList from "@/components/attendance/attendanceList"
import { useAttendanceHistory } from "@/hooks/useAttendance"
import { type AttendanceFilterType } from "@/types/attendanceType"

const Attendance = () => {
  const [filterDate, setFilterDate] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [myPage, setMyPage] = useState<number>(1)
  const [month, setMonth] = useState(String(new Date().getMonth() + 1))
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const PAGE_SIZE = 5

  useEffect(() => {
    setMyPage(1)
  }, [filterStatus, filterDate])

  const {
    data: historyData,
    isPending: isHistoryPending,
    isError: isHistoryError
  } = useAttendanceHistory({
    page: myPage,
    limit: PAGE_SIZE,
    month,
    year,
    filterType: filterStatus !== "ALL" ? filterStatus : undefined
  })

  const historyAttendance = historyData?.data ?? []
  const historyAttendanceTotalPages = historyData?.pagination?.totalPages ?? 0

  const handleFilterStatus = useCallback((value: string) => {
    setFilterStatus(value as AttendanceFilterType)
  }, [])

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
        month={month}
        year={year}
        filterStatus={filterStatus}
        filterDate={filterDate}
        setFilterStatus={handleFilterStatus}
        setFilterDate={setFilterDate}
        setMonth={setMonth}
        setYear={setYear}
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
