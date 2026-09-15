export type RequestType = "LEAVE" | "WFH" | "OT"

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED"

export const REQUEST_TYPE_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: "LEAVE", label: "Nghỉ phép" },
  { value: "WFH", label: "Làm từ xa" },
  { value: "OT", label: "Tăng ca" }
]

export const REQUEST_STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" }
]

export const TABLE_COLUMNS = [
  { value: "ID", label: "Mã / Loại đơn" },
  { value: "PERIOD", label: "Thời gian" },
  { value: "REASON", label: "Lý do" },
  { value: "STATUS", label: "Trạng thái" },
  { value: "PERSON", label: "Người duyệt" },
  { value: "ACTION", label: "Hành động" }
]

type reviewer = {
  id: string
  fullName: string
}

type InfoUser = {
  id: string
  fullName: string
}

export type RequestItem = {
  id: string
  userId: string
  user: InfoUser
  userAvatar?: string | null
  type: RequestType
  startDate: string
  endDate: string
  reason: string
  status: RequestStatus
  reviewedBy?: string | null
  reviewer?: reviewer | null
  rejectReason?: string | null
  createdAt: string
}
