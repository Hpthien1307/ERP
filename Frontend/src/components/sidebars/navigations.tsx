import { User, ScrollText, ClockCheck, NotepadText } from "lucide-react"
import type React from "react"

type sideBarConfig = {
  icon: React.ReactNode
  title: string
  link: string
}

export const navigations: sideBarConfig[] = [
  {
    icon: <ClockCheck size={20} />,
    title: "Chấm công",
    link: "/attendance"
  },
  {
    icon: <ScrollText size={20} />,
    title: "Quản lý công việc",
    link: "/my-tasks"
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
