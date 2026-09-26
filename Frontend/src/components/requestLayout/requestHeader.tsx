import type { RequestItem } from "@/types/requestType"
import Btn from "../ui/button"
import { cn } from "@/lib/utils"
import { FileText, Plus, UserIcon, Users } from "lucide-react"

type RequestHeaderProps = {
  pendingReviewList: RequestItem[]
  activeTab: string
  setActiveTab: (tab: string) => void
  isManagerOrAdmin: boolean
  setIsCreateModalOpen: (open: boolean) => void
}

const RequestHeader = ({ pendingReviewList, activeTab, setActiveTab, isManagerOrAdmin, setIsCreateModalOpen }: RequestHeaderProps) => {
  return (
    <>
      {/* 1. HEADER TRANG & NÚT TẠO ĐƠN */}
      {isManagerOrAdmin ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-x-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs w-fit">
            <Btn
              text="Đơn cần duyệt"
              variant="default"
              size="default"
              classCustom={cn(
                "h-auto px-5 py-2.5 rounded-xl border-none shadow-none",
                activeTab === "review" ? "bg-blue-50 text-blue-600" : "bg-transparent text-slate-500 hover:bg-slate-50"
              )}
              buttonProps={{
                type: "button",
                onClick: () => setActiveTab("review")
              }}
            >
              <Users size={18} />
              {pendingReviewList.length > 0 && (
                <span className="ml-1 w-8 h-8 flex items-center justify-center rounded-full bg-rose-500 text-white text-lg shrink-0">
                  {pendingReviewList.length}
                </span>
              )}
            </Btn>
            <Btn
              text="Đơn của tôi"
              variant="default"
              size="default"
              classCustom={cn(
                "h-auto px-5 py-2.5 rounded-xl border-none shadow-none",
                activeTab === "mine" ? "bg-blue-50 text-blue-600" : "bg-transparent text-slate-500 hover:bg-slate-50"
              )}
              buttonProps={{
                type: "button",
                onClick: () => setActiveTab("mine")
              }}
            >
              <UserIcon size={18} />
            </Btn>
          </div>
          {activeTab === "mine" && (
            <Btn
              text="Tạo yêu cầu mới"
              variant="primary"
              size="default"
              classCustom="shadow-md shadow-blue-500/20 text-xl shrink-0"
              buttonProps={{
                type: "button",
                onClick: () => setIsCreateModalOpen(true)
              }}
            >
              <Plus size={18} />
            </Btn>
          )}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-x-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <FileText size={26} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Quản lý Yêu cầu & Đơn từ</h1>
              <p className="text-slate-500 text-2xl font-normal mt-2">Gửi và theo dõi tình trạng phê duyệt đơn Nghỉ phép, Làm từ xa (WFH), và Tăng ca (OT)</p>
            </div>
          </div>

          <Btn
            text="Tạo yêu cầu mới"
            variant="primary"
            size="default"
            classCustom="shadow-md shadow-blue-500/20 text-xl shrink-0"
            buttonProps={{
              type: "button",
              onClick: () => setIsCreateModalOpen(true)
            }}
          >
            <Plus size={18} />
          </Btn>
        </div>
      )}
    </>
  )
}

export default RequestHeader
