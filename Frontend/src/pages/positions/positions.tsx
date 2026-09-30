import { useState, useEffect, useCallback, useMemo } from "react"
import PositionsHeader from "@/components/positions/positionsHeader"
import PositionsFilter from "@/components/positions/positionsFilter"
import PositionsList from "@/components/positions/positionsList"
import UseDebounce from "@/hooks/useDebounce"
import { usePosition, useCreatePosition, useUpdatePosition, useDeletePosition } from "@/hooks/usePosition"
import { useDepartment } from "@/hooks/useDepartment"
import Modal from "@/components/modal/modal"
import { AlertTriangle, FolderKanban, X } from "lucide-react"
import Input from "@/components/ui/input"
import Select from "@/components/ui/select"
import Btn from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { PositionFormValidation } from "@/validators/positionValidation"
import { positionSchema } from "@/validators/positionValidation"
import { Spinner } from "@/components/ui/spinner"
import { showToast } from "@/components/ui/toast"
import type { PositionItem } from "@/types/positionType"
import { getErrorMessage } from "@/utils/error"

const DEFAULT_FORM_VALUES: PositionFormValidation = {
  id: undefined,
  title: "",
  departmentId: ""
}

const Positions = () => {
  // --- 1. Filter States ---
  const [search, setSearch] = useState<string>("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL")
  const searchDebounce = UseDebounce(search, 500)

  // --- 2. Modal States ---
  const [activeModal, setActiveModal] = useState<"CREATE" | "EDIT" | null>(null)
  const [editingPosition, setEditingPosition] = useState<PositionItem | null>(null)
  const [deletePositionId, setDeletePositionId] = useState<string | null>(null)

  const isEditing = activeModal === "EDIT"
  const isModalOpen = activeModal !== null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PositionFormValidation>({
    resolver: zodResolver(positionSchema),
    defaultValues: DEFAULT_FORM_VALUES
  })

  console.log("editingPosition", editingPosition)

  // Đồng bộ dữ liệu Form theo state Modal & Position được chọn
  useEffect(() => {
    if (isEditing && editingPosition) {
      reset({
        id: editingPosition.id,
        title: editingPosition.title || "",
        departmentId: editingPosition.departmentId || editingPosition.department?.id || ""
      })
    } else {
      reset(DEFAULT_FORM_VALUES)
    }
  }, [editingPosition, isEditing, reset])

  // --- API Hooks ---
  const { data: dataPosition, isPending: loadingPosition, isError, error } = usePosition()
  const { data: dataDepartment } = useDepartment()
  const { mutateAsync: createPosition } = useCreatePosition()
  const { mutateAsync: updatePosition } = useUpdatePosition()
  const { mutateAsync: deletePosition, isPending: isDeleteSubmitting } = useDeletePosition()

  // Filter department options for filter bar
  const filterDepartmentOptions = useMemo(
    () => [
      { value: "ALL", label: "Tất cả phòng ban" },
      ...(dataDepartment?.data?.map(item => ({ value: item.id, label: item.title })) ?? [])
    ],
    [dataDepartment]
  )

  // Department options for form dropdown
  const formDepartmentOptions = useMemo(
    () => [{ value: "", label: "Chọn phòng ban" }, ...(dataDepartment?.data?.map(item => ({ value: item.id, label: item.title })) ?? [])],
    [dataDepartment]
  )

  // Filter local positions list by department & search title
  const filteredPositions = useMemo(() => {
    let list = dataPosition?.data || []

    if (selectedDepartment !== "ALL") {
      list = list.filter(pos => pos.departmentId === selectedDepartment)
    }

    if (searchDebounce.trim()) {
      const kw = searchDebounce.trim().toLowerCase()
      list = list.filter(pos => pos.title?.toLowerCase().includes(kw))
    }

    return list
  }, [dataPosition, selectedDepartment, searchDebounce])

  // --- Handlers ---
  const handleCancel = useCallback(() => {
    reset(DEFAULT_FORM_VALUES)
    setActiveModal(null)
    setEditingPosition(null)
    setDeletePositionId(null)
  }, [reset])

  const handleCreateModal = useCallback(() => {
    setActiveModal("CREATE")
    setEditingPosition(null)
  }, [])

  const handleEdit = useCallback((position: PositionItem) => {
    setEditingPosition(position)
    setActiveModal("EDIT")
  }, [])

  const handleRemove = useCallback((id: string) => {
    setDeletePositionId(id)
  }, [])

  const handleConfirmDelete = () => {
    if (!deletePositionId) return
    deletePosition(deletePositionId, {
      onSuccess: () => {
        showToast.success("Xóa vị trí thành công")
        handleCancel()
      },
      onError: (err: unknown) => {
        showToast.error(getErrorMessage(err) || "Xóa vị trí thất bại!")
      }
    })
  }

  const handleFormSubmit = async (data: PositionFormValidation) => {
    try {
      const payload: Partial<PositionItem> = {
        title: data.title,
        departmentId: data.departmentId
      }

      if (isEditing && editingPosition) {
        await updatePosition({ id: editingPosition.id, data: payload as PositionItem })
      } else {
        await createPosition(payload as PositionItem)
      }
      showToast.success(isEditing ? "Cập nhật vị trí thành công!" : "Tạo vị trí mới thành công!")
      handleCancel()
    } catch (err) {
      console.error("Error updating/creating position:", err)
      showToast.error(getErrorMessage(err) || (isEditing ? "Cập nhật vị trí thất bại!" : "Tạo vị trí thất bại!"))
    }
  }

  return (
    <div className="max-w-full mx-auto flex flex-col gap-y-8 pb-16">
      <PositionsHeader setCreateModal={handleCreateModal} />

      <PositionsFilter
        search={search}
        selectedDepartment={selectedDepartment}
        departmentOptions={filterDepartmentOptions}
        setSearch={setSearch}
        setSelectedDepartment={setSelectedDepartment}
      />

      <PositionsList
        data={filteredPositions}
        loading={loadingPosition}
        error={isError ? (error as Error) : null}
        onEdit={handleEdit}
        onRemove={handleRemove}
      />

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <Modal className="max-w-2xl">
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-x-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <FolderKanban size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900">{isEditing ? "Cập nhật vị trí / chức vụ" : "Tạo vị trí mới"}</h3>
              </div>
            </div>

            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={handleCancel}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 flex flex-col gap-y-6">
            <Input
              label="Tên vị trí / Chức vụ *"
              placeholder="Nhập tên chức vụ..."
              error={errors.title?.message}
              required
              {...register("title")}
            />

            <Select
              label="Phòng ban *"
              error={errors.departmentId?.message}
              required
              options={formDepartmentOptions}
              {...register("departmentId")}
            />

            <div className="flex items-center justify-end gap-x-4 pt-5 border-t border-slate-100">
              <Btn
                text="Hủy bỏ"
                variant="default"
                size="default"
                classCustom="flex-1"
                buttonProps={{ type: "button", onClick: handleCancel }}
              />

              <Btn
                text={isEditing ? "Cập nhật" : "Tạo vị trí"}
                variant="primary"
                size="default"
                classCustom="flex-1"
                buttonProps={{ type: "submit", disabled: isSubmitting }}
              >
                {isSubmitting && <Spinner />}
              </Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Xóa */}
      {!!deletePositionId && (
        <Modal>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-full mb-4">
              <AlertTriangle size={36} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Xác nhận xóa vị trí</h3>
            <p className="text-md text-slate-500 font-normal mb-8 leading-relaxed">
              Bạn có chắc chắn muốn xóa vị trí này không? Hành động này không thể hoàn tác.
            </p>

            <div className="flex items-center justify-center gap-x-4 w-full">
              <Btn
                text="Hủy bỏ"
                variant="default"
                size="default"
                classCustom="flex-1"
                buttonProps={{ type: "button", onClick: handleCancel }}
              />
              <Btn
                variant="error"
                text="Xóa vị trí"
                size="default"
                classCustom="flex-1"
                buttonProps={{ onClick: handleConfirmDelete, disabled: isDeleteSubmitting }}
              >
                {isDeleteSubmitting ? <Spinner /> : null}
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Positions
