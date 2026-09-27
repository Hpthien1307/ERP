const LATE_THRESHOLD = { hour: 8, minute: 30 }

// Chỉ lo 1 việc: check 1 bản ghi có phải "đi trễ" không
export const isCheckInLate = (checkIn: Date): boolean => {
  const hours = checkIn.getHours()
  const minutes = checkIn.getMinutes()
  return hours > LATE_THRESHOLD.hour || (hours === LATE_THRESHOLD.hour && minutes > LATE_THRESHOLD.minute)
}

// Chỉ lo 1 việc: tính đúng giờ/trễ/tổng giờ làm từ danh sách attendance
export const calculateAttendanceCounts = (attendances: { checkIn: Date; workingHours: number | null }[]) => {
  let onTime = 0
  let late = 0
  let totalWorkingHours = 0
  let completedDaysCount = 0
  attendances.forEach(att => {
    if (isCheckInLate(att.checkIn)) late++
    else onTime++
    if (att.workingHours) {
      totalWorkingHours += att.workingHours
      completedDaysCount++
    }
  })

  const avgWorkingHours = completedDaysCount > 0 ? Math.round((totalWorkingHours / completedDaysCount) * 10) / 10 : 0

  return { onTime, late, avgWorkingHours }
}

// Chỉ lo 1 việc: đếm số ngày vắng mặt trong khoảng thời gian
// export const calculateAbsentDays = (
//   startDate: Date,
//   endDate: Date,
//   attendances: { date: Date }[],
//   approvedLeaves: { startDate: Date; endDate: Date }[]
// ): number => {
//   let absentCount = 0
//   const today = new Date()
//   const current = new Date(startDate)

//   while (current <= endDate) {
//     if (current > today) break

//     const dayOfWeek = current.getDay()
//     const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

//     if (!isWeekend) {
//       const hasAttendance = attendances.some(att => new Date(att.date).toDateString() === current.toDateString())
//       const isOnLeave = approvedLeaves.some(l => new Date(l.startDate) <= current && new Date(l.endDate) >= current)
//       if (!hasAttendance && !isOnLeave) absentCount++
//     }

//     current.setDate(current.getDate() + 1)
//   }

//   return absentCount
// }

export const calculateAbsentDays = (
  startDate: Date,
  endDate: Date,
  attendances: { date: Date; checkIn?: Date | null }[],
  approvedLeaves: { startDate: Date; endDate: Date }[]
): number => {
  let absentCount = 0
  const today = new Date()
  const current = new Date(startDate)

  while (current <= endDate) {
    if (current > today) break

    const dayOfWeek = current.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    if (!isWeekend) {
      // 💡 Chỉ tính vắng mặt nếu KHÔNG tìm thấy attendance HOẶC attendance không có checkIn
      const hasCheckedIn = attendances.some(att => new Date(att.date).toDateString() === current.toDateString() && att.checkIn !== null)
      const isOnLeave = approvedLeaves.some(l => new Date(l.startDate) <= current && new Date(l.endDate) >= current)

      if (!hasCheckedIn && !isOnLeave) {
        absentCount++
      }
    }

    current.setDate(current.getDate() + 1)
  }

  return absentCount
}

const WORK_START_HOUR = 8
const WORK_START_MINUTE = 30
const REQUIRED_WORKING_HOURS = 8 // Quy định 8 tiếng/ngày

export type AttendanceStatus = "ON_TIME" | "LATE" | "UNDERTIME" | "LATE_AND_UNDERTIME" | "ABSENT" | "LEAVE"

export const getCheckInStatus = (checkInTime: Date): "ON_TIME" | "LATE" => {
  const workStart = new Date(checkInTime)
  workStart.setHours(WORK_START_HOUR, WORK_START_MINUTE, 0, 0)
  return checkInTime > workStart ? "LATE" : "ON_TIME"
}

// Hàm tính trạng thái cuối cùng khi Check-out
export const calculateFinalStatus = (checkInTime: Date, workingHours: number): AttendanceStatus => {
  const workStart = new Date(checkInTime)
  workStart.setHours(WORK_START_HOUR, WORK_START_MINUTE, 0, 0)

  const isLate = checkInTime > workStart
  const isUndertime = workingHours < REQUIRED_WORKING_HOURS

  if (isLate && isUndertime) return "LATE_AND_UNDERTIME" // Vừa đi trễ vừa thiếu giờ (hoặc gán UNDERTIME tùy UI)
  if (isLate) return "LATE"
  if (isUndertime) return "UNDERTIME" // Thiếu giờ (Về sớm)

  return "ON_TIME"
}
