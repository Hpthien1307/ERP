import { useEffect, useState } from "react"
import Btn from "@/components/ui/button"
import Input from "@/components/ui/input"
import Select from "@/components/ui/select"
import Textarea from "@/components/ui/textarea"
import { useAuth } from "@/store/useAuth"
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Home, X, Send, CalendarDays } from "lucide-react"
import type { RequestItem, RequestType, RequestStatus, PaginatedRequestResponse } from "@/types/requestType"
import { REQUEST_TYPE_OPTIONS } from "@/types/requestType"
import useFetch from "@/hooks/useFetch"
import UseDebounce from "@/hooks/useDebounce"
import { Spinner } from "@/components/ui/spinner"
import type { RequestFormState } from "@/validators/requestValidation"
import { createRequestSchema } from "@/validators/requestValidation"
import { showToast } from "@/components/ui/toast"
import { useCreate } from "@/hooks/useCreate"
import { useUpdate } from "@/hooks/useUdate"

// component
import Modal from "@/components/modal/modal"
import RequestHeader from "@/components/requestLayout/requestHeader"
import RequestStats from "@/components/requestLayout/requestStats"
import RequestFilter from "@/components/requestLayout/requestFilter"
import RequestList from "@/components/requestLayout/requestList"
import { getTodayDateString } from "@/utils/formatters"
import type { RequestStatsFields } from "@/components/requestLayout/requestStats"

const RequestsList = () => {
  const PAGE_SIZE = 5
  const { user } = useAuth()
  const isManagerOrAdmin = user?.role === "MANAGER" || user?.role === "ADMIN"
  // ==== Tab & filter state ====
  const [activeTab, setActiveTab] = useState<"review" | "mine">("review")
  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState("ALL")
  const [selectedStatus, setSelectedStatus] = useState("ALL")
  const searchDebounce = UseDebounce(search, 500)

  // ==== Modal state ====
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<RequestItem | null>(null)
  const [rejectTarget, setRejectTarget] = useState<RequestItem | null>(null)
  const [rejectReasonInput, setRejectReasonInput] = useState("")

  // ==== Form tạo đơn ====
  const [form, setForm] = useState<RequestFormState>({
    type: "LEAVE",
    startDate: getTodayDateString(),
    endDate: getTodayDateString(),
    reason: ""
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RequestFormState, string>>>({})
  const [myPage, setMyPage] = useState(1)
  const [reviewPage, setReviewPage] = useState(1)
  useEffect(() => {
    setMyPage(1)
    setReviewPage(1)
  }, [searchDebounce, selectedType, selectedStatus])

  // ==== Fetch "Đơn của tôi" ====
  const {
    data: myRequestData,
    isPending: isMyRequestPending,
    error: myRequestError
  } = useFetch<PaginatedRequestResponse>({
    url: `/request/user`,
    key: ["get_my_requests", myPage, searchDebounce, selectedType, selectedStatus],
    params: {
      page: myPage,
      limit: PAGE_SIZE,
      search: searchDebounce || undefined,
      type: selectedType !== "ALL" ? selectedType : undefined,
      status: selectedStatus !== "ALL" ? selectedStatus : undefined
    }
  })

  // ==== Fetch "Đơn cần duyệt" (chỉ Manager/Admin, chỉ khi đang mở tab review) ====
  const {
    data: reviewRequestData,
    isPending: isReviewRequestPending,
    error: reviewRequestError
  } = useFetch<PaginatedRequestResponse>({
    url: "/request/manager",
    key: ["get_review_requests", reviewPage, searchDebounce, selectedType, selectedStatus],
    enabled: isManagerOrAdmin && activeTab === "review",
    params: {
      page: reviewPage,
      limit: PAGE_SIZE,
      search: searchDebounce || undefined,
      type: selectedType !== "ALL" ? selectedType : undefined,
      status: selectedStatus !== "ALL" ? selectedStatus : undefined
    }
  })

  const { data: requestStatsData } = useFetch<{ message: string; data: RequestStatsFields }>({
    url: "/request/stats",
    key: ["request_stats"]
  })

  // Không còn filter thủ công nữa — data BE trả về đã đúng theo search/type/status

  const myRequests = myRequestData?.data ?? []
  const myPageCount = myRequestData?.pagination?.totalPages ?? 1

  const reviewRequests = reviewRequestData?.data ?? []
  const reviewPageCount = reviewRequestData?.pagination?.totalPages ?? 1

  const stats = requestStatsData?.data ?? { total: 0, pending: 0, approved: 0, rejected: 0 }

  // ==== Mutations ====
  const { mutate: reviewRequestMutate, isPending: isReviewing } = useUpdate({
    url: "request",
    invalidateKey: ["get_review_requests"],
    successMessage: "Xử lý đơn thành công!"
  })

  const { mutate: createRequest, isPending: isSubmitting } = useCreate({
    url: "/request",
    invalidateKey: ["get_my_requests"],
    successMessage: "Gửi yêu cầu thành công!"
  })

  // ==== Handlers ====
  const handleApprove = (id: string) => {
    reviewRequestMutate({ id, data: { status: "APPROVED" }, subPath: "review" })
  }

  const handleOpenReject = (item: RequestItem) => {
    setRejectTarget(item)
    setRejectReasonInput("")
  }

  const handleConfirmReject = () => {
    if (!rejectTarget || !rejectReasonInput.trim()) {
      showToast.error("Vui lòng nhập lý do từ chối!")
      return
    }
    reviewRequestMutate({
      id: rejectTarget.id,
      data: { status: "REJECTED", rejectReason: rejectReasonInput.trim() },
      subPath: "review"
    })
    setRejectTarget(null)
    setRejectReasonInput("")
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validation = createRequestSchema.safeParse(form)
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof RequestFormState, string>> = {}
      validation.error.issues.forEach(issue => {
        const path = issue.path[0] as keyof RequestFormState
        if (path && !fieldErrors[path]) fieldErrors[path] = issue.message
      })
      setErrors(fieldErrors)
      showToast.error("Vui lòng kiểm tra lại thông tin !")
      return
    }

    setErrors({})
    setIsCreateModalOpen(false)
    createRequest({ ...validation.data, userId: user!.id })
  }

  // ==== Render helpers ====
  const renderTypeBadge = (type: RequestType) => {
    switch (type) {
      case "LEAVE":
        return (
          <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-2xl font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <CalendarDays size={15} className="text-sky-600" />
            Nghỉ phép
          </span>
        )
      case "WFH":
        return (
          <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-2xl font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Home size={15} className="text-purple-600" />
            Làm từ xa (WFH)
          </span>
        )
      case "OT":
        return (
          <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-2xl font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={15} className="text-amber-600" />
            Tăng ca (OT)
          </span>
        )
    }
  }

  const renderStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-2xl font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle size={15} className="text-amber-600" />
            Chờ duyệt
          </span>
        )
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-2xl font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={15} className="text-emerald-600" />
            Đã duyệt
          </span>
        )
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1.5 rounded-full text-2xl font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle size={15} className="text-rose-600" />
            Từ chối
          </span>
        )
    }
  }

  return (
    <div className="max-w-full mx-auto flex flex-col gap-y-8 pb-16">
      <RequestHeader
        pendingReviewList={reviewRequestData?.data ?? []}
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab as "review" | "mine")
        }}
        isManagerOrAdmin={isManagerOrAdmin}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      <RequestStats activeTab={activeTab} user={user} stats={stats} />

      <RequestFilter
        search={search}
        selectedType={selectedType}
        selectedStatus={selectedStatus}
        setSearch={setSearch}
        setSelectedType={setSelectedType}
        setSelectedStatus={setSelectedStatus}
      />

      {/* 4. DANH SÁCH YÊU CẦU (TABLE) */}
      <RequestList
        isManagerOrAdmin={isManagerOrAdmin}
        activeTab={activeTab}
        myTableProps={{
          isPending: isMyRequestPending,
          error: myRequestError,
          items: myRequests,
          renderTypeBadge,
          renderStatusBadge,
          onViewDetail: setSelectedDetail,
          page: myPage,
          pageCount: myPageCount,
          onPageChange: setMyPage
        }}
        reviewTableProps={{
          isPending: isReviewRequestPending,
          error: reviewRequestError,
          items: reviewRequests,
          isReviewing,
          onApprove: handleApprove,
          onReject: handleOpenReject,
          renderTypeBadge,
          page: reviewPage,
          pageCount: reviewPageCount,
          onPageChange: setReviewPage
        }}
      />

      {/* 5. MODAL TẠO YÊU CẦU MỚI */}
      {isCreateModalOpen && (
        <Modal>
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-x-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                <Send size={22} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">Tạo yêu cầu mới</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleCreateSubmit} className="p-8 flex flex-col gap-y-6">
            <Select
              label="Loại yêu cầu *"
              value={form.type}
              onChange={e => setForm(prev => ({ ...prev, type: e.target.value as RequestType }))}
              options={REQUEST_TYPE_OPTIONS}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Từ ngày *"
                type="date"
                min={getTodayDateString()}
                icon={<Calendar size={18} />}
                value={form.startDate}
                onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
              {errors.startDate && <p className="text-red-500 text-xl">{errors.startDate}</p>}
              <Input
                label="Đến ngày *"
                type="date"
                min={form.startDate}
                icon={<Calendar size={18} />}
                onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
              {errors.endDate && <p className="text-red-500 text-xl">{errors.endDate}</p>}
            </div>

            <Textarea
              label="Lý do chi tiết *"
              placeholder="Nhập lý do cụ thể gửi cấp trên phê duyệt..."
              value={form.reason}
              onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}
              rows={4}
              required
              className="w-full min-h-40"
            />
            {errors.reason && <p className="text-red-500 text-xl">{errors.reason}</p>}

            <div className="flex items-center justify-end gap-x-4 pt-4 border-t border-slate-100">
              <Btn
                text="Hủy bỏ"
                variant="default"
                size="default"
                classCustom="flex-1"
                buttonProps={{
                  type: "button",
                  onClick: () => setIsCreateModalOpen(false)
                }}
              />
              <Btn
                text="Gửi yêu cầu"
                variant="primary"
                size="default"
                classCustom="shadow-md shadow-blue-500/20 text-xl flex-1"
                buttonProps={{ type: "submit" }}
              >
                {isSubmitting ? <Spinner className="w-6 h-6" /> : <Send size={18} />}
              </Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Popup lý do từ chối */}
      {rejectTarget && (
        <Modal>
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-3xl font-bold text-slate-900">Từ chối đơn #{rejectTarget.id}</h3>
            <button
              type="button"
              onClick={() => setRejectTarget(null)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 flex flex-col gap-y-5">
            <Textarea
              label="Lý do từ chối *"
              placeholder="Nhập lý do từ chối đơn này..."
              value={rejectReasonInput}
              onChange={e => setRejectReasonInput(e.target.value)}
              rows={4}
              required
              className="w-full min-h-40"
            />

            <div className="flex items-center justify-end gap-x-4 pt-4 border-t border-slate-100">
              <Btn text="Hủy" variant="default" size="default" classCustom="flex-1" buttonProps={{ type: "button", onClick: () => setRejectTarget(null) }} />
              <Btn
                text="Xác nhận từ chối"
                variant="primary"
                size="default"
                classCustom="shadow-md shadow-rose-500/20 text-xl flex-1"
                buttonProps={{
                  type: "button",
                  onClick: handleConfirmReject,
                  disabled: isReviewing || !rejectReasonInput.trim()
                }}
              >
                {isReviewing ? <Spinner className="w-6 h-6" /> : ""}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* 6. MODAL XEM CHI TIẾT ĐƠN */}
      {selectedDetail && (
        <Modal>
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-3xl font-bold text-slate-900 flex items-center gap-x-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                <Send size={22} />
              </div>
              Chi tiết yêu cầu
            </h3>
            <button
              type="button"
              onClick={() => setSelectedDetail(null)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 flex flex-col gap-y-8">
            {selectedDetail.reviewer?.fullName && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-2xl font-medium">Người phê duyệt:</span>
                <span className="font-semibold text-blue-700 text-2xl">{selectedDetail.reviewer?.fullName}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-2xl font-medium">Loại yêu cầu:</span>
              {renderTypeBadge(selectedDetail.type)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-2xl font-medium">Trạng thái:</span>
              {renderStatusBadge(selectedDetail.status)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-2xl font-medium">Thời gian áp dụng:</span>
              <span className="font-semibold text-slate-800 text-2xl">
                {new Date(selectedDetail.startDate).toLocaleDateString("vi-VN")}
                {selectedDetail.startDate !== selectedDetail.endDate && ` - ${new Date(selectedDetail.endDate).toLocaleDateString("vi-VN")}`}
              </span>
            </div>

            <div className="flex flex-col gap-y-4">
              <span className="text-slate-400 text-2xl font-medium">Lý do yêu cầu:</span>
              <p className="text-slate-800 text-2xl bg-slate-50 p-4 rounded-2xl leading-relaxed">{selectedDetail.reason}</p>
            </div>

            {selectedDetail.rejectReason && (
              <div className="flex flex-col gap-y-4">
                <span className="text-rose-500 text-2xl font-medium">Lý do từ chối:</span>
                <p className="text-rose-800 text-2xl bg-rose-50/70 p-4 rounded-2xl border border-rose-200/80 leading-relaxed">{selectedDetail.rejectReason}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default RequestsList
