import { prisma } from "../config/db.js"

export const getRequestStatsData = async (userId: string, month?: number, year?: number, type?: string, status?: string) => {
  const whereCondition: any = {
    userId,
    ...(month &&
      year && {
        createdAt: {
          gte: new Date(Date.UTC(year, month - 1, 1)),
          lte: new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))
        }
      }),
    ...(type && { type }),
    ...(status && { status })
  }
  const grouped = await prisma.request.groupBy({
    by: ["status"],
    where: whereCondition,
    _count: { _all: true }
  })

  return {
    total: grouped.reduce((sum, g) => sum + g._count._all, 0),
    pending: grouped.find(g => g.status === "PENDING")?._count._all ?? 0,
    approved: grouped.find(g => g.status === "APPROVED")?._count._all ?? 0,
    rejected: grouped.find(g => g.status === "REJECTED")?._count._all ?? 0
  }
}
