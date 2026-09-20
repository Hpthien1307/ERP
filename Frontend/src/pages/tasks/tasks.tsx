import Btn from "@/components/ui/button"
import Input from "@/components/ui/input"
import Select from "@/components/ui/select"
import Textarea from "@/components/ui/textarea"
import Modal from "@/components/modal/modal"
import { AlertTriangle, FolderKanban, X } from "lucide-react"
import { useAuth } from "@/store/useAuth"
import { useEffect, useState } from "react"
import { getTodayDateString } from "@/utils/formatters"
import UseDebounce from "@/hooks/useDebounce"
// hooks
import useFetch from "@/hooks/useFetch"
import { useUpdate } from "@/hooks/useUdate"
import { useDelete } from "@/hooks/useDelete"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// components
import TaskHeader from "@/components/task/taskHeader"
import TaskFilter from "@/components/task/taskFilter"
import TaskStats from "@/components/task/taskStats"
import TaskList from "@/components/task/taskList"
import type { TaskStatsFields } from "@/components/task/taskStats"
import type { TaskItem, TaskListResponse } from "@/types/taskType"
import { taskSchema, type TaskFormValidation } from "@/validators/taskValidation"
import { useCreate } from "@/hooks/useCreate"
import { Spinner } from "@/components/ui/spinner"
import { TASK_TYPE_OPTIONS, TASK_PRIORITY_OPTIONS } from "@/types/taskType"
import { showToast } from "@/components/ui/toast"

const Tasks = () => {
  const { user } = useAuth()
  const [createModal, setCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null)
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)
  const [isMyTask, setIsMyTask] = useState(false)
  const [myPage, setMyPage] = useState(1)
  const [search, setSearch] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("ALL")
  const [selectedPriority, setSelectedPriority] = useState("ALL")
  const [selectedCreator, setSelectedCreator] = useState("ALL")
  const searchDebounce = UseDebounce(search, 500)
  const today = getTodayDateString()

  const isManager = user?.role === "MANAGER"
  const isEditing = !!editingTask
  const isReadOnlyFields = isEditing && !isManager
  const isModalOpen = createModal || isEditing

  const formStatusOptions = TASK_TYPE_OPTIONS.filter(opt => opt.value !== "ALL")
  const formPriorityOptions = TASK_PRIORITY_OPTIONS.filter(opt => opt.value !== "ALL")

  const myMemberAll = [
    { value: "", label: "Chọn người phụ trách" },
    ...(user?.department?.users?.map(member => ({
      value: member.id,
      label: member.fullName
    })) ?? [])
  ]

  const myMemberTask = [
    { value: "ALL", label: "Tất cả người phụ trách" },
    ...(user?.department?.users
      ?.filter(member => member.role !== "MANAGER")
      ?.map(member => ({
        value: member.id,
        label: member.fullName
      })) ?? [])
  ]

  // Reset trang về 1 khi bất kỳ điều kiện lọc nào thay đổi
  useEffect(() => {
    setMyPage(1)
  }, [searchDebounce, selectedStatus, selectedPriority, selectedCreator, isMyTask])

  // fetch tasks (tất cả hoặc công việc của tôi)
  const {
    data: dataTasks,
    isPending: loadingTasks,
    isError,
    error
  } = useFetch<TaskListResponse>({
    url: isMyTask ? "/task/me" : "/task",
    key: ["tasks", isMyTask ? "my_tasks" : "all_tasks", myPage, searchDebounce, selectedStatus, selectedPriority, selectedCreator],
    params: {
      page: myPage,
      limit: 10,
      search: searchDebounce.trim() || undefined,
      status: selectedStatus !== "ALL" ? selectedStatus : undefined,
      priority: selectedPriority !== "ALL" ? selectedPriority : undefined,
      assigneeId: !isMyTask && selectedCreator !== "ALL" ? selectedCreator : undefined
    }
  })

  // form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormValidation>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      id: undefined,
      title: "",
      description: "",
      assigneeId: "",
      priority: "NORMAL",
      status: "TODO",
      dueDate: today
    }
  })

  const { data: taskStatsData } = useFetch<{ message: string; data: TaskStatsFields }>({
    url: "/task/stats",
    key: ["task_stats"]
  })

  useEffect(() => {
    if (editingTask) {
      reset({
        id: editingTask.id,
        title: editingTask.title,
        description: editingTask.description,
        assigneeId: editingTask.assignee?.id || "",
        priority: editingTask.priority || "NORMAL",
        status: editingTask.status,
        dueDate: editingTask.dueDate ? editingTask.dueDate.split("T")[0] : today
      })
    } else if (!createModal) {
      reset({
        id: undefined,
        title: "",
        description: "",
        assigneeId: "",
        priority: "NORMAL",
        status: "TODO",
        dueDate: today
      })
    }
  }, [editingTask, createModal, reset, today])

  const pageCount = dataTasks?.pagination?.totalPages ?? 1
  const stats = taskStatsData?.data ?? { total: 0, todo: 0, inProgress: 0, inReview: 0, completed: 0, overDue: 0 }

  const { mutate: updateStatus } = useUpdate({
    url: "/task",
    invalidateKey: ["tasks"],
    successMessage: "Cập nhật trạng thái công việc thành công!"
  })

  const { mutateAsync: createTask } = useCreate<TaskFormValidation>({
    url: "/task",
    invalidateKey: ["tasks"],
    successMessage: "Tạo công việc mới thành công!"
  })

  const { mutateAsync: updateTask } = useUpdate<Partial<TaskFormValidation>>({
    url: "/task",
    invalidateKey: ["tasks"],
    successMessage: "Cập nhật công việc thành công!"
  })

  const { mutate: deleteTask, isPending: isDeleting } = useDelete({
    url: "/task",
    invalidateKey: ["tasks"],
    successMessage: "Xóa công việc thành công!"
  })

  const handleUpdateStatus = (id: string, status: string) => {
    updateStatus({ id, data: { status } })
  }

  const handleToggleMyTask = () => {
    setIsMyTask(prev => !prev)
    setMyPage(1)
  }

  const handleFormSubmit = async (data: TaskFormValidation) => {
    try {
      if (editingTask) {
        if (isManager) {
          const { ...payload } = data
          await updateTask({ id: editingTask.id, data: payload })
        } else {
          await updateTask({ id: editingTask.id, data: { status: data.status } })
        }
      } else {
        await createTask(data)
      }
      handleCancel()
    } catch (error) {
      console.error(error)
      showToast.error(editingTask ? "Cập nhật công việc thất bại!" : "Tạo công việc thất bại! Vui lòng thử lại!")
    }
  }

  const handleCancel = () => {
    reset({
      id: undefined,
      title: "",
      description: "",
      assigneeId: "",
      priority: "NORMAL",
      status: "TODO",
      dueDate: today
    })
    setCreateModal(false)
    setEditingTask(null)
  }

  const handleConfirmDelete = () => {
    if (deleteTaskId) {
      deleteTask(deleteTaskId, {
        onSuccess: () => {
          setDeleteTaskId(null)
        }
      })
    }
  }

  return (
    <div className="max-w-full mx-auto flex flex-col gap-y-8 pb-16">
      {/* 1. HEADER SECTION */}
      <TaskHeader user={user} setCreateModal={() => setCreateModal(!createModal)} />

      {/* 2. STATS CARDS TỔNG QUAN */}
      {isMyTask ? <TaskStats statsData={stats} /> : ""}

      {/* 3. BỘ LỌC & TÌM KIẾM (SỬ DỤNG INPUT & SELECT) */}
      <TaskFilter
        isMyTask={isMyTask}
        handleMyTask={handleToggleMyTask}
        search={search}
        selectedStatus={selectedStatus}
        selectedPriority={selectedPriority}
        selectedCreator={selectedCreator}
        myMember={myMemberTask}
        setSearch={setSearch}
        setSelectedStatus={setSelectedStatus}
        setSelectedPriority={setSelectedPriority}
        setSelectedCreator={setSelectedCreator}
      />

      {/* 4. BẢNG DANH SÁCH CÔNG VIỆC */}
      <TaskList
        isManager={isManager}
        data={dataTasks?.data ?? []}
        loading={loadingTasks}
        error={isError ? (error as Error) || new Error("Không thể tải danh sách công việc") : null}
        pageCount={pageCount}
        page={myPage}
        onPageChange={page => setMyPage(page)}
        onUpdateStatus={handleUpdateStatus}
        onRemove={id => setDeleteTaskId(id)}
        onEditTask={task => setEditingTask(task)}
      />

      {/* MODAL TẠO / SỬA CÔNG VIỆC */}
      {isModalOpen && (
        <Modal className="max-w-5xl">
          {/* Header Modal */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-x-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <FolderKanban size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900">
                  {createModal ? "Tạo công việc mới" : isManager ? "Chỉnh sửa công việc" : "Chi tiết công việc"}
                </h3>
                <p className="text-md text-slate-500 font-normal mt-0.5">
                  {createModal
                    ? "Điền các thông tin chi tiết để giao việc và theo dõi tiến độ"
                    : isManager
                      ? "Cập nhật thông tin chi tiết nhiệm vụ"
                      : "Cập nhật trạng thái nhiệm vụ"}
                </p>
              </div>
            </div>

            {/* Nút đóng modal */}
            <div className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer" onClick={handleCancel}>
              <X size={20} />
            </div>
          </div>

          {/* Body Modal - Form Fields */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 flex flex-col gap-y-6 max-h-[75vh] overflow-y-auto">
            <Input
              label="Tiêu đề công việc *"
              placeholder="Nhập tên nhiệm vụ cần thực hiện..."
              error={errors.title?.message}
              required
              disabled={isReadOnlyFields}
              {...register("title")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Trạng thái" error={errors.status?.message} required options={formStatusOptions} {...register("status")} />
              <Select
                label="Người phụ trách (Assignee) *"
                error={errors.assigneeId?.message}
                required
                disabled={isReadOnlyFields}
                options={myMemberAll}
                {...register("assigneeId")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Mức độ ưu tiên *"
                error={errors.priority?.message}
                required
                disabled={isReadOnlyFields}
                options={formPriorityOptions}
                {...register("priority")}
              />

              <Input label="Hạn hoàn thành (Deadline) *" type="date" min={today} required disabled={isReadOnlyFields} {...register("dueDate")} />
            </div>

            <Textarea
              label="Mô tả chi tiết công việc"
              placeholder="Mô tả yêu cầu chi tiết, mục tiêu nghiệm thu, checklist thực hiện..."
              rows={4}
              error={errors.description?.message}
              required
              disabled={isReadOnlyFields}
              {...register("description")}
            />

            <div className="flex items-center justify-end gap-x-4 pt-5 border-t border-slate-100">
              <Btn text="Hủy bỏ" variant="default" size="default" classCustom="flex-1" buttonProps={{ type: "button", onClick: handleCancel }} />

              <Btn
                text={editingTask ? "Cập nhật" : "Tạo công việc"}
                variant="primary"
                size="default"
                classCustom="flex-1"
                buttonProps={{
                  type: "submit",
                  disabled: isSubmitting
                }}
              >
                {isSubmitting && <Spinner />}
              </Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL XÁC NHẬN XÓA CÔNG VIỆC */}
      {deleteTaskId && (
        <Modal className="max-w-2xl">
          <div className="p-8 flex flex-col items-center text-center">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-full mb-4">
              <AlertTriangle size={36} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Xác nhận xóa công việc</h3>
            <p className="text-md text-slate-500 font-normal mb-8 leading-relaxed">
              Bạn có chắc chắn muốn xóa công việc này không? Dữ liệu sau khi xóa sẽ không thể phục hồi.
            </p>

            <div className="flex items-center justify-center gap-x-4 w-full">
              <Btn
                text="Hủy bỏ"
                variant="default"
                size="default"
                classCustom="flex-1"
                buttonProps={{
                  type: "button",
                  onClick: () => setDeleteTaskId(null),
                  disabled: isDeleting
                }}
              />
              <Btn
                variant="error"
                text="Xóa công việc"
                size="default"
                classCustom="flex-1"
                buttonProps={{
                  onClick: handleConfirmDelete,
                  disabled: isDeleting
                }}
              >
                {isDeleting ? <Spinner /> : ""}
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Tasks
