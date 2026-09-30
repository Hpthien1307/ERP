import type { PaginationType, ROLE_TYPE, STATUS_ACCOUNT, GENDER_TYPE } from "./globalType"

export type EmployeeItem = {
  id: string
  fullName: string
  email: string
  role: ROLE_TYPE
  status: STATUS_ACCOUNT
  gender: GENDER_TYPE
  birthday: string
  phoneNumber: string
  address: string
  department?: {
    id: string
    title: string
  }
  position?: {
    id: string
    title: string
  }
}

// MỚI — dùng riêng cho modal edit, đủ field
export type EmployeeDetail = {
  id: string
  fullName: string
  email: string
  phone?: string
  birthday?: string
  address?: string
  bio?: string
  gender: GENDER_TYPE
  leaveBalance: number
  role: ROLE_TYPE
  status: STATUS_ACCOUNT
  department?: { id: string; title: string }
  position?: { id: string; title: string }
}

export type EmployeeResponse = {
  message: string
  data: EmployeeItem[] | null
}

export type EmployeeListResponse = {
  message: string
  data: EmployeeItem[]
  pagination: PaginationType
}

// MỚI
export type EmployeeDetailResponse = {
  message: string
  data: EmployeeDetail
}

export type EmployeeListParams = {
  search?: string
  departmentId?: string
  positionId?: string
  page?: number
  limit?: number
}

export const TABLE_COLUMNS_EMPLOYEES = [
  { value: "ID", label: "ID" },
  { value: "FULL_NAME", label: "Họ và tên" },
  { value: "EMAIL", label: "Email" },
  { value: "PHONE", label: "Số điện thoại" },
  { value: "ROLE", label: "Vai trò" },
  { value: "DEPARTMENT", label: "Phòng ban" },
  { value: "POSITION", label: "Chức vụ" },
  { value: "ACTIONS", label: "Hành động" }
]
