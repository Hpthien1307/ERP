import { useState } from "react"
import Btn from "@/components/ui/button"
import Input from "@/components/ui/input"
import Select from "@/components/ui/select"
import Textarea from "@/components/ui/textarea"
import { useAuth } from "@/store/useAuth"
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Home,
  X,
  Eye,
  Send,
  CalendarDays,
  UserIcon,
  Users,
  CheckCircle
} from "lucide-react"
import type { RequestItem, RequestType, RequestStatus } from "@/types/requestType"
import { REQUEST_TYPE_OPTIONS, REQUEST_STATUS_OPTIONS, TABLE_COLUMNS } from "@/types/requestType"
import useFetch from "@/hooks/useFetch"
import UseDebounce from "@/hooks/useDebounce"
import { Spinner } from "@/components/ui/spinner"
import type { RequestFormState } from "@/validations/requestValidation"
import { createRequestSchema } from "@/validations/requestValidation"
import { showToast } from "@/utils/toast"
import { useCreate } from "@/hooks/useCreate"
import { useUpdate } from "@/hooks/useUdate"
import { cn } from "@/lib/utils"

const Requests = () => {
  const { user } = useAuth()
  const isManagerOrAdmin = user?.role === "MANAGER" || user?.role === "ADMIN"
  const [activeTab, setActiveTab] = useState<"review" | "mine">("review")

  const {
    data: requestPendingReviewData,
    isPending: isPendingReview,
    error: errorPendingReview
  } = useFetch<{
    messages: string
    data: RequestItem[]
  }>({
    url: "/request/manager",
    key: ["get_request_review"],
    enabled: isManagerOrAdmin && activeTab === "review"
  })

  const {
    data: requestData,
    isPending,
    error
  } = useFetch<{
    messages: string
    data: RequestItem[]
  }>({
    url: `/request/user/${user?.id}`,
    key: ["get_request_me"]
  })

  const pendingReviewList = requestPendingReviewData?.data?.filter(item => item.status === "PENDING") ?? []

  const { mutate: reviewRequest, isPending: isReviewing } = useUpdate({
    url: "request",
    invalidateKey: ["get_request_all_users", "get_request_manager"],
    successMessage: "Xử lý đơn thành công!"
  })

  const [rejectTarget, setRejectTarget] = useState<RequestItem | null>(null)
  const [rejectReasonInput, setRejectReasonInput] = useState("")

  const handleApprove = (id: string) => {
    reviewRequest({ id, data: { status: "APPROVED" }, subPath: "review" })
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
    reviewRequest({
      id: rejectTarget.id,
      data: { status: "REJECTED", rejectReason: rejectReasonInput.trim() },
      subPath: "review"
    })
    setRejectTarget(null)
    setRejectReasonInput("")
  }

  // State bộ lọc và tìm kiếm
  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState("ALL")
  const [selectedStatus, setSelectedStatus] = useState("ALL")
  const searchDebounce = UseDebounce(search, 500)

  // State Modal tạo đơn mới
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<RequestItem | null>(null)

  // State form tạo yêu cầu
  const [form, setForm] = useState<RequestFormState>({
    type: "LEAVE",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    reason: ""
  })

  const [errors, setErrors] = useState<Partial<Record<keyof RequestFormState, string>>>({})

  const filteredRequests = requestData?.data?.filter(item => {
    const matchSearch = item?.reason?.toLowerCase().includes(searchDebounce.toLowerCase())
    const matchType = selectedType === "ALL" || item?.type === selectedType
    const matchStatus = selectedStatus === "ALL" || item?.status === selectedStatus
    return matchSearch && matchType && matchStatus
  })

  const filteredRequestsReview = pendingReviewList?.filter(item => {
    const matchSearch = item?.reason?.toLowerCase().includes(searchDebounce.toLowerCase())
    const matchType = selectedType === "ALL" || item?.type === selectedType
    const matchStatus = selectedStatus === "ALL" || item?.status === selectedStatus
    return matchSearch && matchType && matchStatus
  })

  const stats = {
    total: requestData?.data?.length || 0,
    pending: requestData?.data?.filter(r => r.status === "PENDING").length || 0,
    approved: requestData?.data?.filter(r => r.status === "APPROVED").length || 0,
    rejected: requestData?.data?.filter(r => r.status === "REJECTED").length || 0
  }

  const { mutate: createRequest, isPending: isSubmitting } = useCreate({
    url: "/request",
    invalidateKey: ["get_request_user"],
    successMessage: "Gửi yêu cầu thành công!"
  })

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

  return (
    <div className="max-w-full mx-auto flex flex-col gap-y-8 pb-16">
      {/* 1. HEADER TRANG & NÚT TẠO ĐƠN */}
      {isManagerOrAdmin ? (
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

      {/* 2. STATS CARDS TỔNG QUAN */}
      {activeTab === "mine" || user.role === "EMPLOYEE" ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText size={26} />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xl font-medium">Tổng số đơn</span>
              <span className="text-3xl font-bold text-slate-900">{stats.total}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock size={26} />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xl font-medium">Chờ phê duyệt</span>
              <span className="text-3xl font-bold text-amber-600">{stats.pending}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={26} />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xl font-medium">Đã phê duyệt</span>
              <span className="text-3xl font-bold text-emerald-600">{stats.approved}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-x-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle size={26} />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xl font-medium">Bị từ chối</span>
              <span className="text-3xl font-bold text-rose-600">{stats.rejected}</span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {/* 3. BỘ LỌC VÀ TÌM KIẾM */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full flex-1">
          <Input placeholder="Tìm theo lý do, người gửi..." icon={<Search size={18} />} value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full sm:w-80">
            <Select icon={<Filter size={18} />} value={selectedType} onChange={e => setSelectedType(e.target.value)} options={REQUEST_TYPE_OPTIONS} />
          </div>

          <div className="w-full sm:w-80">
            <Select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} options={REQUEST_STATUS_OPTIONS} />
          </div>
        </div>
      </div>

      {/* 4. DANH SÁCH YÊU CẦU (TABLE) */}
      {isManagerOrAdmin && activeTab === "review" ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold text-2xl">
                  <th className="py-4.5 px-6">Loại đơn</th>
                  <th className="py-4.5 px-6">Nhân viên</th>
                  <th className="py-4.5 px-6">Thời gian</th>
                  <th className="py-4.5 px-6">Lý do</th>
                  <th className="py-4.5 px-6 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-2xl text-slate-700">
                {isPendingReview && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <Spinner className="size-16" />
                    </td>
                  </tr>
                )}

                {!isPendingReview && errorPendingReview && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-rose-400 text-2xl font-medium">
                      {errorPendingReview.message || "Không thể tải dữ liệu."}
                    </td>
                  </tr>
                )}

                {!isPendingReview && filteredRequestsReview.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 text-2xl font-medium">
                      <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                      Không có đơn nào cần duyệt.
                    </td>
                  </tr>
                )}

                {filteredRequestsReview.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-6">{renderTypeBadge(item.type)}</td>
                    <td className="py-5 px-6 font-medium">{item.user?.fullName ?? "—"}</td>
                    <td className="py-5 px-6">
                      {new Date(item.startDate).toLocaleDateString("vi-VN")}
                      {item.startDate !== item.endDate && ` - ${new Date(item.endDate).toLocaleDateString("vi-VN")}`}
                    </td>
                    <td className="py-5 px-6 max-w-xs">
                      <p className="line-clamp-2">{item.reason}</p>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center justify-center gap-x-2">
                        <button
                          type="button"
                          disabled={isReviewing}
                          onClick={() => handleApprove(item.id)}
                          className="inline-flex items-center gap-x-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle size={16} />
                          Duyệt
                        </button>
                        <button
                          type="button"
                          disabled={isReviewing}
                          onClick={() => handleOpenReject(item)}
                          className="inline-flex items-center gap-x-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <XCircle size={16} />
                          Từ chối
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold text-2xl">
                  {TABLE_COLUMNS.map(item => (
                    <th className="py-4.5 px-6" key={item.value}>
                      {item.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="relative divide-y min-h-80 divide-slate-100 text-2xl text-slate-700">
                {isPending && (
                  <tr className="absolute top-1/2 left-1/2 -translate-1/2">
                    <td colSpan={6} className="py-16 text-center">
                      <Spinner className="size-16" />
                    </td>
                  </tr>
                )}

                {!isPending && error && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-rose-400 text-2xl font-medium">
                      <XCircle size={40} className="mx-auto text-rose-300 mb-3" />
                      {error.message || "Không thể tải dữ liệu. Vui lòng thử lại sau."}
                    </td>
                  </tr>
                )}

                {filteredRequests && filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 text-2xl font-medium">
                      <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                      Không tìm thấy đơn nào của bạn
                    </td>
                  </tr>
                )}

                {/* --- DATA --- */}
                {filteredRequests?.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-6 font-medium">
                      <div className="flex flex-col gap-y-1.5 items-start">
                        {renderTypeBadge(item.type)}
                        <span className="text-slate-400 text-xl">#{item.id}</span>
                      </div>
                    </td>

                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-y-1">
                        <div className="flex items-center gap-x-2 text-slate-800 font-medium">
                          <span className="text-2xl">
                            {new Date(item.startDate).toLocaleDateString("vi-VN")}
                            {item.startDate !== item.endDate && ` - ${new Date(item.endDate).toLocaleDateString("vi-VN")}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-5 px-6 max-w-xs">
                      <p className="line-clamp-2 text-slate-700 font-normal leading-relaxed">{item.reason}</p>
                    </td>

                    <td className="py-5 px-6">{renderStatusBadge(item.status)}</td>

                    <td className="py-5 px-6">
                      <span className="font-medium text-2xl text-slate-700">{item.reviewer?.fullName || "Chưa có"}</span>
                    </td>

                    <td className="py-5 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedDetail(item)}
                        className="inline-flex items-center justify-center p-2.5 rounded-2xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Xem chi tiết đơn"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. MODAL TẠO YÊU CẦU MỚI */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
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

            {/* Modal Body */}
            <form onSubmit={handleCreateSubmit} className="p-8 flex flex-col gap-y-6">
              <Select
                label="Loại yêu cầu *"
                value={form.type}
                onChange={e => setForm(prev => ({ ...prev, type: e.target.value as RequestType }))}
                options={REQUEST_TYPE_OPTIONS}
              />

              {/* Ngày bắt đầu & Ngày kết thúc */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Từ ngày *"
                  type="date"
                  icon={<Calendar size={18} />}
                  value={form.startDate}
                  onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
                {errors.startDate && <p className="text-red-500 text-xl">{errors.startDate}</p>}
                <Input
                  label="Đến ngày *"
                  type="date"
                  icon={<Calendar size={18} />}
                  value={form.endDate}
                  onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
                {errors.endDate && <p className="text-red-500 text-xl">{errors.endDate}</p>}
              </div>

              {/* Lý do */}
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

              {/* Footer Buttons */}
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
          </div>
        </div>
      )}

      {/* Popup lý do từ chối */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95">
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
          </div>
        </div>
      )}

      {/* 6. MODAL XEM CHI TIẾT ĐƠN */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95">
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
                <div className="flex flex-col gap-y-4 ">
                  <span className="text-rose-500 text-2xl font-medium">Lý do từ chối:</span>
                  <p className="text-rose-800 text-2xl bg-rose-50/70 p-4 rounded-2xl border border-rose-200/80 leading-relaxed">
                    {selectedDetail.rejectReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Requests
