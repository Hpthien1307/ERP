import { prisma } from "../config/db.js"

export const getRequestStatsData = async (userId: string) => {
  const grouped = await prisma.request.groupBy({
    by: ["status"],
    where: { userId },
    _count: { _all: true }
  })

  return {
    total: grouped.reduce((sum, g) => sum + g._count._all, 0),
    pending: grouped.find(g => g.status === "PENDING")?._count._all ?? 0,
    approved: grouped.find(g => g.status === "APPROVED")?._count._all ?? 0,
    rejected: grouped.find(g => g.status === "REJECTED")?._count._all ?? 0
  }
}
