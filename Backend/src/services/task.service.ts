import { prisma } from "../config/db.js"

export const getTaskStatsData = async (userId: string) => {
  const grouped = await prisma.task.groupBy({
    by: ["status"],
    where: { assigneeId: userId },
    _count: { _all: true }
  })

  const overDue = await prisma.task.count({
    where: { assigneeId: userId, dueDate: { lt: new Date() }, status: { not: "COMPLETED" } }
  })

  return {
    total: grouped.reduce((sum, g) => sum + g._count._all, 0),
    todo: grouped.find(g => g.status === "TODO")?._count._all ?? 0,
    inProgress: grouped.find(g => g.status === "IN_PROGRESS")?._count._all ?? 0,
    inReview: grouped.find(g => g.status === "IN_REVIEW")?._count._all ?? 0,
    completed: grouped.find(g => g.status === "COMPLETED")?._count._all ?? 0,
    overDue
  }
}
