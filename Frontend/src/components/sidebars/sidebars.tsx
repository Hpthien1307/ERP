import { navigations } from "./navigations"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/store/useAuth"
import { LogOut } from "lucide-react"

const Sidebars = () => {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const handleLogout = async () => {
    await signOut()
  }

  return (
    <aside className="sidebar fixed top-0 left-0 w-120 h-full bg-white border-r border-slate-200/80 flex flex-col justify-between z-50 shadow-xs">
      {/* Top Section: Logo & Brand */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-x-4">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-blue-600 to-sky-500 text-4xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
            E
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-x-2 font-bold tracking-wider text-slate-900">
              ERP
              <span className="text-xl font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/70">SYSTEM</span>
            </div>
            <span className="text-slate-400 text-lg truncate">Quản trị doanh nghiệp</span>
          </div>
        </div>

        {/* Navigations List */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <ul className="flex flex-col gap-y-2">
            {navigations.map((item, index) => {
              const isActive = location.pathname === item.link

              return (
                <li key={index}>
                  <Link
                    to={item.link}
                    className={`flex items-center gap-x-4 px-4 py-3.5 rounded-2xl transition-all duration-100 group ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <span className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`}>{item.icon}</span>
                    <span className="truncate">{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Bottom Section: User Profile & Logout */}
      <div className="p-5 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between gap-x-3">
          <div className="flex items-center gap-x-3 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 border border-blue-200/80 flex items-center justify-center text-blue-700 font-bold shrink-0 overflow-hidden text-2xl">
              {user?.avatar ? (
                <img src={user?.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : user?.fullName ? (
                user.fullName.charAt(0).toUpperCase()
              ) : (
                "U"
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-slate-900 font-semibold truncate text-xl">{user?.fullName || "Người dùng"}</span>
              <span className="text-lg text-slate-500 truncate">{user?.role || "Nhân viên"}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebars
