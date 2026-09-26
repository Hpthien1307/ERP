import WrapperMain from "@/components/wrapper/wrapperMain"
import FormLogin from "./siginForm"
import { useAuth } from "@/store/useAuth"
import { Navigate } from "react-router-dom"
import { navigations } from "@/components/sidebars/navigations"
const Login = () => {
  const goLink = navigations[0].link
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <Navigate to={goLink} replace />
  }
  return (
    <WrapperMain classCustom="page-login">
      <div className="flex h-screen">
        {/* Left Hero Section */}
        <div className="w-1/2 h-full hidden lg:block">
          <div className="relative py-20 px-16 h-full flex flex-col justify-between">
            <div className="full-ab after:content-[''] after:absolute after:inset-0 after:bg-linear-to-t after:from-black/90 after:via-black/50 after:to-black/30">
              <img src="./bg-login.jpg" alt="ERP Background" />
            </div>
            <div className="w-full h-full flex flex-col justify-between z-10">
              <div className="flex flex-col">
                <div className="text-3xl w-max rounded-full font-bold uppercase box-glasses py-3 px-8 tracking-widest">
                  ERP <span className="text-sm font-normal opacity-70 border-l border-white/30 pl-2">SYSTEM</span>
                </div>
                <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mt-16">
                  Giải pháp quản trị <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 via-indigo-200 to-white">doanh nghiệp toàn diện</span>
                </h1>
                <p className="text-2xl font-normal text-white/80 leading-relaxed mt-6 max-w-xl">
                  Tối ưu hóa quy trình, kết nối nguồn lực và thúc đẩy tăng trưởng bứt phá trên một nền tảng hợp nhất.
                </p>
              </div>
              <p className="text-xl text-white/60 mt-14">© 2026 Huynh Phuc Thien. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full h-full bg-gr flex items-center justify-center p-12 lg:w-1/2">
          <div className="w-200 lg:w-[80%] max-w-full bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/60 flex flex-col gap-y-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Chào mừng trở lại</h2>
              <p className=" text-gray-500 mt-2">Vui lòng đăng nhập để truy cập hệ thống ERP</p>
            </div>
            <FormLogin />
          </div>
        </div>
      </div>
    </WrapperMain>
  )
}

export default Login
