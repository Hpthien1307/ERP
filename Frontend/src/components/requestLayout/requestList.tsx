import type { RequestItem, RequestStatus, RequestType } from "@/types/requestType"
import MyRequestTable from "./MyRequestTable"
import ReviewRequestTable from "./ReviewRequestTable"

type RequestListProps = {
  isManagerOrAdmin: boolean
  activeTab: "mine" | "review"
  myTableProps: {
    isPending: boolean
    error: Error | null
    items: RequestItem[]
    renderTypeBadge: (type: RequestType) => React.ReactNode
    renderStatusBadge: (status: RequestStatus) => React.ReactNode
    onViewDetail: (item: RequestItem | null) => void
    page: number
    pageCount: number
    onPageChange: (page: number) => void
  }
  reviewTableProps: {
    isPending: boolean
    error: Error | null
    items: RequestItem[]
    isReviewing: boolean
    onApprove: (id: string) => void
    onReject: (item: RequestItem) => void
    renderTypeBadge: (type: RequestType) => React.ReactNode
    page: number
    pageCount: number
    onPageChange: (page: number) => void
  }
}

const RequestList = ({ isManagerOrAdmin, activeTab, myTableProps, reviewTableProps }: RequestListProps) => {
  if (isManagerOrAdmin && activeTab === "review") {
    return <ReviewRequestTable {...reviewTableProps} />
  }
  return <MyRequestTable {...myTableProps} />
}

export default RequestList
