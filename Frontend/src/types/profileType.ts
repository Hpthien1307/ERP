import type { ROLE_TYPE } from "./globalType"

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" }
]

export const ROLE_NAME_MAP: Record<ROLE_TYPE, string> = {
  ADMIN: "Quản trị viên",
  MANAGER: "Trưởng phòng",
  EMPLOYEE: "Nhân viên"
}
