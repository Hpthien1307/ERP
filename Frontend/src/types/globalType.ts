export type PaginationType = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type GENDER_TYPE = "MALE" | "FEMALE" | "OTHER"
export type ROLE_TYPE = "ADMIN" | "MANAGER" | "EMPLOYEE"

type DepartmentMember = {
  id: string
  fullName: string
  email: string
  role: ROLE_TYPE
  avatarUrl?: string
}

type departmentInfo = {
  id: string
  title: string
  users?: DepartmentMember[]
}

type positionInfo = {
  id: string
  title: string
}
export type UserState = {
  id: string
  fullName: string
  email: string
  role: ROLE_TYPE
  avatar?: string
  position?: positionInfo
  department?: departmentInfo
  bio?: string
  phone?: string
  gender?: GENDER_TYPE
  birthday?: string
  address?: string
  leaveBalance?: number
  createdAt?: Date
  updatedAt?: Date
}
