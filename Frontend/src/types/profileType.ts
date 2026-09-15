export type GENDER_TYPE = "MALE" | "FEMALE" | "OTHER"
export type ROLE_TYPE = "ADMIN" | "MANAGER" | "EMPLOYEE"

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" }
]

export const ROLE_NAME_MAP: Record<ROLE_TYPE, string> = {
  ADMIN: "Quản trị viên (Admin)",
  MANAGER: "Trưởng phòng (Manager)",
  EMPLOYEE: "Nhân viên (Employee)"
}

type departmentInfo = {
  id: string
  title: string
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
