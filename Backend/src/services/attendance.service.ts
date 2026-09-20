import { prisma } from "../config/db.js"
import { calculateAttendanceCounts, calculateAbsentDays } from "../utils/attendanceStats.util.js"

export const getAttendanceStatsData = async (userId: string) => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  const [attendances, approvedLeaves] = await Promise.all([
    prisma.attendance.findMany({ where: { userId, date: { gte: startOfMonth, lte: endOfMonth } } }),
    prisma.request.findMany({
      where: { userId, type: "LEAVE", status: "APPROVED", startDate: { lte: endOfMonth }, endDate: { gte: startOfMonth } }
    })
  ])

  const { onTime, late, avgWorkingHours } = calculateAttendanceCounts(attendances)
  const absent = calculateAbsentDays(startOfMonth, endOfMonth, attendances, approvedLeaves)

  return { onTime, late, absent, avgWorkingHours }
}
