import type { ROLE_TYPE } from "./globalType"

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" }
]

export const ROLE_NAME_MAP: Record<ROLE_TYPE, string> = {
  ADMIN: "Quản trị viên",
  MANAGER: "Quản lí",
  EMPLOYEE: "Nhân viên"
}

export const ROLE_NAME_OPTIONS = Object.entries(ROLE_NAME_MAP).map(([value, label]) => ({ value, label }))
