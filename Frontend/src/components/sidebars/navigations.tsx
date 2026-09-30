import { User, ScrollText, ClockCheck, NotepadText, Grid, Settings } from "lucide-react"
import type React from "react"

type sideBarConfig = {
  icon: React.ReactNode
  title: string
  link: string
  isAdmin?: boolean
}

export const navigations: sideBarConfig[] = [
  {
    icon: <Grid size={20} />,
    title: "Tổng quan",
    link: "/dashboard"
  },
  {
    icon: <ClockCheck size={20} />,
    title: "Chấm công",
    link: "/attendance",
    isAdmin: false
  },
  {
    icon: <ScrollText size={20} />,
    title: "Quản lý công việc",
    link: "/my-tasks",
    isAdmin: false
  },
  {
    icon: <NotepadText size={20} />,
    title: "Đơn từ & nghỉ phép",
    link: "/my-requests",
    isAdmin: false
  },
  {
    icon: <Settings size={20} />,
    title: "Quản lí nhân sự",
    link: "/employees",
    isAdmin: true
  },
  {
    icon: <Settings size={20} />,
    title: "Quản lí phòng ban",
    link: "/departments",
    isAdmin: true
  },
  {
    icon: <Settings size={20} />,
    title: "Quản lí chức vụ",
    link: "/positions",
    isAdmin: true
  },
  {
    icon: <User size={20} />,
    title: "Thông tin cá nhân",
    link: "/profile"
  }
]
