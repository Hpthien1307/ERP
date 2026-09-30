import { useState, useEffect, useCallback, useMemo } from "react"
import EmployeesFilter from "@/components/employees/employeesFilter"
import EmployeesHeader from "@/components/employees/employeesHeader"
import EmployeesList from "@/components/employees/employeesList"
import UseDebounce from "@/hooks/useDebounce"
import { useDepartment } from "@/hooks/useDepartment"
import { usePosition } from "@/hooks/usePosition"
import Modal from "@/components/modal/modal"
import { AlertTriangle, FolderKanban, X } from "lucide-react"
import Input from "@/components/ui/input"
import Select from "@/components/ui/select"
import Btn from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { EmployeeFormValidation } from "@/validators/employeeValidation"
import { employeeSchema } from "@/validators/employeeValidation"
import { GENDER_OPTIONS, ROLE_NAME_OPTIONS } from "@/types/profileType"
import { Spinner } from "@/components/ui/spinner"
import { getTodayDateString } from "@/utils/formatters"
import { useCreateEmployee, useDeleteEmployee, useEmployees, useUpdateEmployee } from "@/hooks/useEmployee"
import { showToast } from "@/components/ui/toast"
import type { UserState } from "@/types/globalType"

// Giá trị mặc định của Form
const DEFAULT_FORM_VALUES: EmployeeFormValidation = {
  id: undefined,
  fullName: "",
  password: "",
  email: "",
  phone: "",
  gender: "MALE",
  birthday: "",
  address: "",
  bio: "",
  leaveBalance: 12,
  role: "EMPLOYEE",
  departmentId: "",
  positionId: ""
}

const Employees = () => {
  // --- 1. Filter & Pagination States ---
  const [search, setSearch] = useState<string>("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL")
  const [selectedPosition, setSelectedPosition] = useState<string>("ALL")
  const [myPage, setMyPage] = useState<number>(1)
  const searchDebounce = UseDebounce(search, 500)

  // --- 2. Modal States (Gom gọn lại) ---
  // - activeModal: null (đóng), 'CREATE' (tạo mới), 'EDIT' (chỉnh sửa)
  const [activeModal, setActiveModal] = useState<"CREATE" | "EDIT" | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<UserState | null>(null)
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null)
  const today = getTodayDateString()
  const isEditing = activeModal === "EDIT"
  const isModalOpen = activeModal !== null

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<EmployeeFormValidation>({
    resolver: zodResolver(employeeSchema),
    defaultValues: DEFAULT_FORM_VALUES
  })

  // Reset trang về 1 khi lọc
  useEffect(() => {
    setMyPage(1)
  }, [searchDebounce, selectedDepartment, selectedPosition])

  // Đồng bộ dữ liệu Form theo state Modal & Employee được chọn
  useEffect(() => {
    if (isEditing && editingEmployee) {
      console.log("editingEmployee", editingEmployee.position)
      reset({
        id: editingEmployee?.id,
        fullName: editingEmployee?.fullName,
        email: editingEmployee?.email,
        password: "",
        phone: editingEmployee?.phone,
        gender: editingEmployee?.gender,
        birthday: editingEmployee?.birthday?.split("T")[0] || "",
        address: editingEmployee?.address,
        leaveBalance: editingEmployee?.leaveBalance,
        role: editingEmployee?.role,
        departmentId: editingEmployee?.department?.id || "",
        positionId: editingEmployee?.position?.id || ""
      })
    } else {
      reset(DEFAULT_FORM_VALUES)
    }
  }, [editingEmployee, isEditing, reset])

  const { mutateAsync: createEmployee } = useCreateEmployee()
  const { mutateAsync: updateEmployee } = useUpdateEmployee()
  const { mutateAsync: deleteEmployee, isPending: isDeleteSubmitting } = useDeleteEmployee()
  const { data: dataDepartment } = useDepartment()
  const { data: dataPosition } = usePosition()
  // --- Options dùng Memo để tối ưu render ---
  const selectedDepartmentId = watch("departmentId")

  useEffect(() => {
    if (selectedDepartmentId) {
      const position = dataPosition?.data?.find(item => item.departmentId === selectedDepartmentId)
      if (position) {
        setValue("positionId", position.id)
      }
    }
  }, [selectedDepartmentId, setValue, dataPosition])

  const filteredPositions = useMemo(
    () => dataPosition?.data?.filter(item => item.departmentId === selectedDepartmentId) ?? [],
    [dataPosition, selectedDepartmentId]
  )

  // --- API Hooks ---
  const {
    data: dataEmployees,
    isPending: loadingEmployees,
    isError,
    error
  } = useEmployees({
    page: myPage,
    limit: 10,
    search: searchDebounce.trim() || undefined,
    departmentId: selectedDepartment !== "ALL" ? selectedDepartment : undefined,
    positionId: selectedPosition !== "ALL" ? selectedPosition : undefined
  })

  const filterDepartmentOptions = useMemo(
    () => [
      { value: "ALL", label: "Tất cả phòng ban" },
      ...(dataDepartment?.data?.map(item => ({ value: item.id, label: item.title })) ?? [])
    ],
    [dataDepartment]
  )

  const filterPositionsByDepartment = useMemo(
    () => dataPosition?.data?.filter(item => item.departmentId === selectedDepartment) ?? [],
    [dataPosition, selectedDepartment]
  )

  const filterPositionOptions = useMemo(
    () => [
      { value: "ALL", label: "Tất cả vị trí" },
      ...(filterPositionsByDepartment?.map(item => ({ value: item.id, label: item.title || "" })) ?? [])
    ],
    [filterPositionsByDepartment]
  )

  // Reset vị trí khi đổi phòng ban ở bộ lọc
  useEffect(() => {
    setSelectedPosition("ALL")
  }, [selectedDepartment])

  const formDepartmentOptions = useMemo(
    () => [{ value: "", label: "Chọn phòng ban" }, ...(dataDepartment?.data?.map(item => ({ value: item.id, label: item.title })) ?? [])],
    [dataDepartment]
  )

  const formPositionOptions = useMemo(
    () => [{ value: "", label: "Chọn vị trí" }, ...(filteredPositions?.map(item => ({ value: item.id, label: item.title || "" })) ?? [])],
    [filteredPositions]
  )

  const pageCount = dataEmployees?.pagination?.totalPages || 0

  // --- Handlers ---
  const handleCancel = useCallback(() => {
    reset(DEFAULT_FORM_VALUES)
    setActiveModal(null)
    setEditingEmployee(null)
    setDeleteEmployeeId(null)
  }, [reset, setActiveModal, setEditingEmployee, setDeleteEmployeeId])

  const handleCreateModal = useCallback(() => {
    setActiveModal("CREATE")
    setEditingEmployee(null)
  }, [setActiveModal, setEditingEmployee])

  const handleEdit = useCallback(
    (employee: UserState) => {
      setEditingEmployee(employee)
      setActiveModal("EDIT")
    },
    [setActiveModal, setEditingEmployee]
  )

  const handleRemove = useCallback(
    (id: string) => {
      setDeleteEmployeeId(id)
    },
    [setDeleteEmployeeId]
  )

  const handleConfirmDelete = () => {
    if (!deleteEmployeeId) return
    deleteEmployee(deleteEmployeeId, {
      onSuccess: () => {
        showToast.success("Xóa thành công")
        handleCancel()
      }
    })
  }

  const handleFormSubmit = async (data: EmployeeFormValidation) => {
    try {
      const submitData = { ...data }
      if (isEditing && !submitData.password) {
        delete submitData.password
      }
      if (isEditing && editingEmployee) {
        await updateEmployee({ id: editingEmployee.id, data: submitData })
      } else {
        await createEmployee(submitData)
      }
      showToast.success(isEditing ? "Cập nhật nhân viên thành công!" : "Thêm nhân viên thành công!")
      handleCancel()
    } catch (err) {
      console.error("Error updating/creating employee:", err)
      showToast.error(isEditing ? "Cập nhật nhân viên thất bại!" : "Thêm nhân viên thất bại! Vui lòng thử lại!")
    }
  }

  return (
    <div className="max-w-full mx-auto flex flex-col gap-y-8 pb-16">
      <EmployeesHeader setCreateModal={handleCreateModal} />

      <EmployeesFilter
        search={search}
        selectedDepartment={selectedDepartment}
        selectedPosition={selectedPosition}
        setSearch={setSearch}
        departmentOptions={filterDepartmentOptions}
        positionOptions={filterPositionOptions}
        setSelectedDepartment={setSelectedDepartment}
        setSelectedPosition={setSelectedPosition}
        isPositionDisabled={selectedDepartment === "ALL"}
      />

      <EmployeesList
        data={dataEmployees?.data || []}
        loading={loadingEmployees}
        error={isError ? error : null}
        page={myPage}
        pageCount={pageCount}
        onPageChange={setMyPage}
        onEdit={handleEdit}
        onRemove={handleRemove}
      />

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <Modal className="max-w-5xl">
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-x-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <FolderKanban size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900">{isEditing ? "Cập nhật thông tin thành viên" : "Thêm thành viên mới"}</h3>
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

          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 flex flex-col gap-y-6 max-h-[85vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Họ tên *" placeholder="Nhập họ và tên..." error={errors.fullName?.message} required {...register("fullName")} />
              <Select label="Giới tính" error={errors.gender?.message} required options={GENDER_OPTIONS} {...register("gender")} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Số điện thoại" placeholder="Nhập số điện thoại..." error={errors.phone?.message} {...register("phone")} />
              <Input label="Ngày sinh" type="date" max={today} error={errors.birthday?.message} {...register("birthday")} />
            </div>

            <div className={!isEditing ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "grid grid-cols-1 gap-4"}>
              <Input label="Email *" placeholder="Nhập email..." error={errors.email?.message} required {...register("email")} />
              {!isEditing && (
                <Input
                  label="Mật khẩu *"
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  error={errors.password?.message}
                  required
                  {...register("password")}
                />
              )}
            </div>

            <Input label="Địa chỉ" placeholder="Nhập địa chỉ..." error={errors.address?.message} {...register("address")} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Phòng ban *"
                error={errors.departmentId?.message}
                {...register("departmentId")}
                options={formDepartmentOptions}
              />
              <Select
                label="Vị trí *"
                error={errors.positionId?.message}
                {...register("positionId")}
                options={formPositionOptions}
                disabled={!selectedDepartmentId}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Vai trò *" error={errors.role?.message} {...register("role")} options={ROLE_NAME_OPTIONS} />
              <Input
                label="Số ngày nghỉ"
                type="number"
                placeholder="Nhập số ngày nghỉ..."
                max={12}
                error={errors.leaveBalance?.message}
                {...register("leaveBalance")}
              />
            </div>

            <div className="flex items-center justify-end gap-x-4 pt-5 border-t border-slate-100">
              <Btn
                text="Hủy bỏ"
                variant="default"
                size="default"
                classCustom="flex-1"
                buttonProps={{ type: "button", onClick: handleCancel }}
              />

              <Btn
                text={isEditing ? "Cập nhật" : "Thêm nhân viên"}
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
      {!!deleteEmployeeId && (
        <Modal>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-full mb-4">
              <AlertTriangle size={36} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Xác nhận xóa nhân viên</h3>
            <p className="text-md text-slate-500 font-normal mb-8 leading-relaxed">
              Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này không thể hoàn tác.
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
                text="Xóa nhân viên"
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

export default Employees
