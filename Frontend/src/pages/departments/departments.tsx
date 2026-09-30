import { useState, useEffect, useCallback, useMemo } from "react"
import DepartmentsHeader from "@/components/departments/departmentsHeader"
import DepartmentsFilter from "@/components/departments/departmentsFilter"
import DepartmentsList from "@/components/departments/departmentsList"
import UseDebounce from "@/hooks/useDebounce"
import { useDepartment, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from "@/hooks/useDepartment"
import { useEmployees } from "@/hooks/useEmployee"
import Modal from "@/components/modal/modal"
import { AlertTriangle, FolderKanban, X } from "lucide-react"
import Input from "@/components/ui/input"
import Select from "@/components/ui/select"
import Btn from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { DepartmentFormValidation } from "@/validators/departmentValidation"
import { departmentSchema } from "@/validators/departmentValidation"
import { Spinner } from "@/components/ui/spinner"
import { showToast } from "@/components/ui/toast"
import type { DepartmentItem } from "@/types/departmentType"
import { getErrorMessage } from "@/utils/error"

const DEFAULT_FORM_VALUES: DepartmentFormValidation = {
  id: undefined,
  title: "",
  managerId: ""
}

const Departments = () => {
  // --- 1. Filter States ---
  const [search, setSearch] = useState<string>("")
  const searchDebounce = UseDebounce(search, 500)

  // --- 2. Modal States ---
  const [activeModal, setActiveModal] = useState<"CREATE" | "EDIT" | null>(null)
  const [editingDepartment, setEditingDepartment] = useState<DepartmentItem | null>(null)
  const [deleteDepartmentId, setDeleteDepartmentId] = useState<string | null>(null)

  const isEditing = activeModal === "EDIT"
  const isModalOpen = activeModal !== null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<DepartmentFormValidation>({
    resolver: zodResolver(departmentSchema),
    defaultValues: DEFAULT_FORM_VALUES
  })

  // Đồng bộ dữ liệu Form theo state Modal & Department được chọn
  useEffect(() => {
    if (isEditing && editingDepartment) {
      reset({
        id: editingDepartment.id,
        title: editingDepartment.title || "",
        managerId: editingDepartment.managerId || editingDepartment.manager?.id || ""
      })
    } else {
      reset(DEFAULT_FORM_VALUES)
    }
  }, [editingDepartment, isEditing, reset])

  // --- API Hooks ---
  const { data: dataDepartment, isPending: loadingDepartment, isError, error } = useDepartment()
  const { mutateAsync: createDepartment } = useCreateDepartment()
  const { mutateAsync: updateDepartment } = useUpdateDepartment()
  const { mutateAsync: deleteDepartment, isPending: isDeleteSubmitting } = useDeleteDepartment()

  // Fetch employees list for manager select dropdown
  const { data: dataEmployees } = useEmployees({ page: 1, limit: 100 })

  const managerOptions = useMemo(() => {
    let employees = dataEmployees?.data || []
    if (editingDepartment?.id) {
      employees = employees.filter(
        emp =>
          emp.department?.id === editingDepartment.id ||
          emp.id === editingDepartment.manager?.id ||
          emp.id === editingDepartment.managerId
      )
    }
    return [
      { value: "", label: "Chưa phân công" },
      ...employees.map(emp => ({
        value: emp.id,
        label: `${emp.fullName} (${emp.email})`
      }))
    ]
  }, [dataEmployees, editingDepartment])

  // Filter local departments data by search keyword
  const filteredDepartments = useMemo(() => {
    const list = dataDepartment?.data || []
    if (!searchDebounce.trim()) return list
    const kw = searchDebounce.trim().toLowerCase()
    return list.filter(dept => dept.title.toLowerCase().includes(kw))
  }, [dataDepartment, searchDebounce])

  // --- Handlers ---
  const handleCancel = useCallback(() => {
    reset(DEFAULT_FORM_VALUES)
    setActiveModal(null)
    setEditingDepartment(null)
    setDeleteDepartmentId(null)
  }, [reset])

  const handleCreateModal = useCallback(() => {
    setActiveModal("CREATE")
    setEditingDepartment(null)
  }, [])

  const handleEdit = useCallback(
    (department: DepartmentItem) => {
      setEditingDepartment(department)
      setActiveModal("EDIT")
    },
    []
  )

  const handleRemove = useCallback(
    (id: string) => {
      setDeleteDepartmentId(id)
    },
    []
  )

  const handleConfirmDelete = () => {
    if (!deleteDepartmentId) return
    deleteDepartment(deleteDepartmentId, {
      onSuccess: () => {
        showToast.success("Xóa phòng ban thành công")
        handleCancel()
      },
      onError: (err: unknown) => {
        showToast.error(getErrorMessage(err) || "Xóa phòng ban thất bại!")
      }
    })
  }

  const handleFormSubmit = async (data: DepartmentFormValidation) => {
    try {
      const payload = {
        title: data.title,
        managerId: data.managerId || null
      }

      if (isEditing && editingDepartment) {
        await updateDepartment({ id: editingDepartment.id, data: payload })
      } else {
        await createDepartment(payload)
      }
      showToast.success(isEditing ? "Cập nhật phòng ban thành công!" : "Thêm phòng ban mới thành công!")
      handleCancel()
    } catch (err) {
      console.error("Error updating/creating department:", err)
      showToast.error(getErrorMessage(err) || (isEditing ? "Cập nhật phòng ban thất bại!" : "Thêm phòng ban thất bại!"))
    }
  }

  return (
    <div className="max-w-full mx-auto flex flex-col gap-y-8 pb-16">
      <DepartmentsHeader setCreateModal={handleCreateModal} />

      <DepartmentsFilter search={search} setSearch={setSearch} />

      <DepartmentsList
        data={filteredDepartments}
        loading={loadingDepartment}
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
                <h3 className="text-3xl font-bold text-slate-900">
                  {isEditing ? "Cập nhật thông tin phòng ban" : "Thêm phòng ban mới"}
                </h3>
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
              label="Tên phòng ban *"
              placeholder="Nhập tên phòng ban..."
              error={errors.title?.message}
              required
              {...register("title")}
            />

            <Select
              label="Trưởng phòng"
              error={errors.managerId?.message}
              options={managerOptions}
              {...register("managerId")}
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
                text={isEditing ? "Cập nhật" : "Thêm phòng ban"}
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
      {!!deleteDepartmentId && (
        <Modal>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-full mb-4">
              <AlertTriangle size={36} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Xác nhận xóa phòng ban</h3>
            <p className="text-md text-slate-500 font-normal mb-8 leading-relaxed">
              Bạn có chắc chắn muốn xóa phòng ban này không? Hành động này không thể hoàn tác.
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
                text="Xóa phòng ban"
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

export default Departments
