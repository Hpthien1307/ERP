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

  attendances.forEach(att => {
    if (isCheckInLate(att.checkIn)) late++
    else onTime++
    if (att.workingHours) totalWorkingHours += att.workingHours
  })

  const avgWorkingHours = attendances.length > 0 ? Math.round((totalWorkingHours / attendances.length) * 10) / 10 : 0

  return { onTime, late, avgWorkingHours }
}

// Chỉ lo 1 việc: đếm số ngày vắng mặt trong khoảng thời gian
export const calculateAbsentDays = (
  startDate: Date,
  endDate: Date,
  attendances: { date: Date }[],
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
      const hasAttendance = attendances.some(att => new Date(att.date).toDateString() === current.toDateString())
      const isOnLeave = approvedLeaves.some(l => new Date(l.startDate) <= current && new Date(l.endDate) >= current)
      if (!hasAttendance && !isOnLeave) absentCount++
    }

    current.setDate(current.getDate() + 1)
  }

  return absentCount
}
