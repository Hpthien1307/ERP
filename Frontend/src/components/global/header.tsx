import { useLocation } from "react-router-dom"
import { navigations } from "../sidebars/navigations"
import { Calendar } from "lucide-react"
import NotificationDropdown from "./NotificationDropdown"

const Header = () => {
  const location = useLocation()

  const currentNav = navigations.find(item => item.link === location.pathname)
  const pageTitle = currentNav?.title || "Bảng điều khiển"

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0 shadow-xs">
      <div className="flex items-center gap-x-3">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-x-6 text-slate-500">
        <div className="hidden sm:flex items-center gap-x-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/70">
          <Calendar size={16} className="text-blue-600" />
          <span className="capitalize">{today}</span>
        </div>

        <NotificationDropdown />
      </div>
    </header>
  )
}

export default Header
