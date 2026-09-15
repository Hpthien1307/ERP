import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import Btn from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/store/useAuth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema, type SignInInput } from "@/validations/siginInValidation"

const FormLogin = () => {
  const { signIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data: SignInInput) => {
    const { email, password } = data
    await signIn(email, password)
  }

  return (
    <form className="flex flex-col gap-y-5 w-full mt-2" onSubmit={handleSubmit(onSubmit)}>
      {/* Input Username / Email */}
      <div className="flex flex-col gap-y-2">
        <label className=" font-semibold text-gray-700">Tên đăng nhập hoặc Email</label>
        <div className="relative flex items-center border border-gray-300/80 rounded-2xl bg-white/90 px-4 py-4 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-xs">
          <Mail className="w-6 h-6 text-gray-400 shrink-0 mr-3" />
          <input
            type="text"
            aria-current="true"
            autoComplete="username"
            placeholder="Nhập email hoặc tên tài khoản"
            {...register("email")}
            className="w-full text-xl text-gray-800 placeholder:text-gray-400 bg-transparent outline-none border-none"
          />
        </div>
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
      </div>

      {/* Input Password */}
      <div className="flex flex-col gap-y-2">
        <label className=" font-semibold text-gray-700">Mật khẩu</label>
        <div className="relative flex items-center border border-gray-300/80 rounded-2xl bg-white/90 px-4 py-4 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-xs">
          <Lock className="w-6 h-6 text-gray-400 shrink-0 mr-3" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            aria-current="true"
            autoComplete="current-password"
            {...register("password")}
            className="w-full text-xl text-gray-800 placeholder:text-gray-400 bg-transparent outline-none border-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
          </button>
        </div>
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
      </div>

      <Btn
        text="Đăng nhập"
        variant="primary"
        size="large"
        classCustom="w-full mt-2 rounded-2xl justify-center"
        buttonProps={{ type: "submit" }}
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner className="w-6 h-6" />}
        {!isSubmitting && <LogIn size={20} />}
      </Btn>
    </form>
  )
}

export default FormLogin
