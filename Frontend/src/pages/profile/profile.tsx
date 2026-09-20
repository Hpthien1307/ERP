import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/store/useAuth"
import { useUpdate } from "@/hooks/useUdate"
import { showToast } from "@/components/ui/toast"
import Input from "@/components/ui/input"
import Textarea from "@/components/ui/textarea"
import Select from "@/components/ui/select"
import Btn from "@/components/ui/button"
import { User, Mail, Phone, MapPin, Calendar, Building2, Camera, Save, Edit3, Clock, KeyIcon, CalendarCheck } from "lucide-react"
import { profileSchema, type ProfileFormValidation } from "@/validators/profileValidation"
import { getTodayDateString } from "@/utils/formatters"
import { GENDER_OPTIONS, ROLE_NAME_MAP } from "@/types/profileType"

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar ?? null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormValidation>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phoneNumber: user?.phone || "",
      gender: user?.gender || "MALE",
      birthday: user?.birthday?.split("T")[0] || "",
      address: user?.address || "",
      bio: user?.bio || ""
    }
  })

  // Theo dõi fullName để render lên header ngay khi gõ, không cần đợi submit
  const watchedFullName = watch("fullName")

  const { mutateAsync: updateProfile, isPending: submitting } = useUpdate({
    url: "/users", // KHÔNG gắn id ở đây - useUpdate tự nối id vào path
    invalidateKey: ["update_profile"],
    successMessage: "Cập nhật thông tin cá nhân thành công!",
    isMultipart: !!avatarFile
  })

  // Đồng bộ lại form mỗi khi user trong store thay đổi (vd: sau khi fetch lại / F5)
  useEffect(() => {
    reset({
      fullName: user?.fullName || "",
      phoneNumber: user?.phone || "",
      gender: user?.gender || "MALE",
      birthday: user?.birthday?.split("T")[0] || "",
      address: user?.address || "",
      bio: user?.bio || ""
    })
    setAvatarPreview(user?.avatar ?? null)
  }, [user, reset])

  // Dọn blob URL cũ mỗi khi có ảnh mới hoặc component unmount
  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      showToast.error("Vui lòng chọn định dạng file ảnh hợp lệ (PNG, JPG, WEBP)!")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast.error("Dung lượng ảnh tối đa là 5MB!")
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    showToast.success("Đã chọn ảnh mới. Bấm 'Lưu thay đổi' để cập nhật.")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setAvatarFile(null)
    reset({
      fullName: user?.fullName || "",
      phoneNumber: user?.phone || "",
      gender: user?.gender || "MALE",
      birthday: user?.birthday?.split("T")[0] || "",
      address: user?.address || "",
      bio: user?.bio || ""
    })
    setAvatarPreview(user?.avatar ?? null)
  }

  const buildUpdatePayload = (data: ProfileFormValidation): FormData | Record<string, string | null> => {
    const fields: Record<string, string | null> = {
      fullName: data.fullName.trim(),
      phone: data.phoneNumber ? data.phoneNumber.trim() : null,
      gender: data.gender || "MALE",
      address: data.address ? data.address.trim() : null,
      bio: data.bio ? data.bio.trim() : null,
      birthday: data.birthday || null
    }

    if (!avatarFile) return fields

    const formData = new FormData()
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value)
    })
    formData.append("avatar", avatarFile)
    return formData
  }

  const onSubmit = async (data: ProfileFormValidation) => {
    const payload = buildUpdatePayload(data)
    await updateProfile({ id: user!.id, data: payload }) // truyền đúng shape {id, data} theo useUpdate
    setIsEditing(false)
    setAvatarFile(null)
    console.log("submit")
  }

  return (
    <div className="max-w-full mx-auto flex flex-col gap-y-8 pb-16">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="h-40 sm:h-48 bg-linear-to-r from-blue-600 via-sky-600 to-indigo-600 relative">
          <div className="absolute inset-0 bg-black/5" />
        </div>

        <div className="px-8 pb-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              <div className="relative -mt-20 sm:-mt-24 shrink-0">
                <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-white border-4 border-white shadow-lg p-1 overflow-hidden flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-5xl font-bold text-blue-700">
                      {watchedFullName ? watchedFullName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAvatarClick}
                  title="Thay đổi ảnh đại diện"
                  className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-2xl shadow-md border-2 border-white cursor-pointer transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                >
                  <Camera size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-y-2 pt-2 sm:pt-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{watchedFullName || "Người dùng"}</h2>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-2xl">
                  <span className="flex items-center gap-x-1.5">
                    <Mail size={18} className="text-blue-600" />
                    {user?.email || "Chưa có email"}
                  </span>
                  {user?.id && <span className="text-slate-400">ID: #{user.id.slice(0, 8)}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-x-3 w-full md:w-auto justify-end pt-4 md:pt-0">
              {!isEditing ? (
                <Btn
                  text="Chỉnh sửa thông tin"
                  variant="primary"
                  size="default"
                  classCustom="shadow-md shadow-blue-500/20 text-xl row-reverse"
                  buttonProps={{ type: "button", onClick: () => setIsEditing(true) }}
                >
                  <Edit3 size={18} />
                </Btn>
              ) : (
                <div className="flex items-center gap-x-3">
                  <Btn
                    text="Hủy bỏ"
                    variant="default"
                    size="default"
                    loading={submitting}
                    buttonProps={{ type: "button", onClick: handleCancel, disabled: submitting }}
                  />
                  <Btn
                    text="Lưu thay đổi"
                    variant="primary"
                    size="default"
                    classCustom="shadow-md shadow-blue-500/20 text-xl"
                    loading={submitting}
                    buttonProps={{ form: "profile-form", type: "submit", disabled: submitting || isSubmitting }}
                  >
                    {!submitting && <Save size={18} />}
                  </Btn>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="flex flex-col gap-y-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-y-5">
            <h3 className="text-3xl font-bold text-slate-900 flex items-center gap-x-2.5 border-b border-slate-100 pb-4">
              <Building2 className="text-blue-600" size={26} /> Thông tin tổ chức
            </h3>

            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-1">
                <span className="text-slate-400 text-xl font-medium">Phòng ban công tác</span>
                <span className="font-semibold text-slate-800">{user?.department?.title || "Chưa phân bổ"}</span>
              </div>

              <div className="flex flex-col gap-y-1">
                <span className="text-slate-400 text-xl font-medium">Chức vụ / Vị trí</span>
                <span className="font-semibold text-slate-800">{user?.position?.title || "Nhân viên"}</span>
              </div>

              <div className="flex flex-col gap-y-1">
                <span className="text-slate-400 text-xl font-medium">Vai trò hệ thống</span>
                <span className="font-semibold text-slate-800">{user?.role ? ROLE_NAME_MAP[user.role] || user.role : ""}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                {user?.createdAt && (
                  <div className="flex flex-col gap-y-1">
                    <span className="text-slate-400 text-xl font-medium">Ngày gia nhập</span>
                    <span className="font-medium text-slate-800 flex items-center gap-x-1.5">
                      <Clock size={16} className="text-slate-400" />
                      <span>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</span>
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-y-1">
                  <span className="text-slate-400 text-xl font-medium">Số ngày phép</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-x-1.5">
                    <CalendarCheck size={16} />
                    <span>{user?.leaveBalance ?? 12} ngày</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/60 p-6 rounded-3xl border border-blue-100/80 flex flex-col gap-y-3">
            <div className="flex items-center text-3xl gap-x-2 text-blue-800 font-bold">
              <KeyIcon size={24} className="text-blue-600" /> Bảo mật & Tài khoản
            </div>
            <p className="text-slate-600 text-2xl leading-relaxed">
              Email đăng nhập và các quyền hạn tổ chức do Quản trị viên (Admin) phê duyệt. Để thay đổi các thông tin này, vui lòng liên hệ phòng Hành chính Nhân
              sự.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <h3 className="text-3xl font-bold text-slate-900 flex items-center gap-x-2.5">
                <User className="text-blue-600" size={26} /> Hồ sơ cá nhân
              </h3>
              {isEditing && <span className="font-normal text-blue-700 bg-blue-50 px-6 py-2 rounded-full border border-blue-200">Đang chỉnh sửa</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Họ và tên *"
                icon={<User size={18} />}
                {...register("fullName")}
                error={errors.fullName?.message}
                placeholder="Nhập họ và tên đầy đủ"
                disabled={!isEditing}
              />

              <Input
                label="Địa chỉ Email"
                icon={<Mail size={18} />}
                value={user?.email || ""}
                placeholder="email@example.com"
                disabled={true}
                title="Email định danh hệ thống không thể tự chỉnh sửa"
              />

              <Input
                label="Số điện thoại"
                icon={<Phone size={18} />}
                {...register("phoneNumber")}
                error={errors.phoneNumber?.message}
                placeholder="0912 345 678"
                disabled={!isEditing}
              />

              <Select label="Giới tính" {...register("gender")} options={GENDER_OPTIONS} disabled={!isEditing} />

              <Input label="Ngày sinh" max={getTodayDateString()} type="date" icon={<Calendar size={18} />} {...register("birthday")} disabled={!isEditing} />

              <Input
                label="Địa chỉ liên hệ"
                icon={<MapPin size={18} />}
                {...register("address")}
                error={errors.address?.message}
                placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
                disabled={!isEditing}
              />
            </div>

            <Textarea
              label="Giới thiệu bản thân (Bio)"
              rows={4}
              {...register("bio")}
              error={errors.bio?.message}
              placeholder="Chia sẻ đôi nét về kinh nghiệm làm việc hoặc mục tiêu cá nhân..."
              disabled={!isEditing}
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
