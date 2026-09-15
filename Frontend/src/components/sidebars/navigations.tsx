import { User, LayoutDashboard, ScrollText, ClockCheck, NotepadText } from "lucide-react"
import type React from "react"

type sideBarConfig = {
  icon: React.ReactNode
  title: string
  link: string
}

export const navigations: sideBarConfig[] = [
  {
    icon: <LayoutDashboard size={20} />,
    title: "Tổng quan",
    link: "/dashboard"
  },
  {
    icon: <ScrollText size={20} />,
    title: "Công việc của tôi",
    link: "/my-tasks"
  },
  {
    icon: <ClockCheck size={20} />,
    title: "Chấm công",
    link: "/attendance"
  },
  {
    icon: <NotepadText size={20} />,
    title: "Đơn từ & nghỉ phép",
    link: "/my-requests"
  },
  {
    icon: <User size={20} />,
    title: "Thông tin cá nhân",
    link: "/profile"
  }
]
