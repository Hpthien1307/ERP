import type { PaginationType } from "./globalType"

export type PositionItem = {
  id: string
  title?: string
  departmentId?: string
  department?: {
    id?: string
    title: string
  }
  users?: {
    id: string
    fullName: string
    email?: string
  }[]
  createdAt?: string
}

export type PositionResponse = {
  message: string
  data?: PositionItem[]
  pagination?: PaginationType
}

