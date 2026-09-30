import type { PaginationType } from "./globalType"

export type DepartmentItem = {
  id: string
  title: string
  managerId?: string | null
  manager?: {
    id: string
    fullName: string
    email?: string
  } | null
  users?: {
    id: string
    fullName: string
    email?: string
  }[]
  createdAt?: string
}

export type DepartmentListResponse = {
  message: string
  data: DepartmentItem[]
  pagination?: PaginationType
}

