// utils/pagination.util.ts
import type { Request } from "express"

export const getPaginationParams = (req: Request) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

export const buildPaginationResponse = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit)
})
