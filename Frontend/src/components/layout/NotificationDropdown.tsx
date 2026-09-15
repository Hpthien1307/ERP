import { useEffect, useRef, useState } from "react"
import { Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"

import useFetch from "@/hooks/useFetch"
import { axiosClient } from "@/api/axiosClient"
import { socket } from "@/lib/socket"
import type { Notification, NotificationResponse, UnreadCountResponse } from "@/types/notificationType"

const NotificationDropdown = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTabNoti, setActiveTabNoti] = useState<"all" | "unread">("all")

  // ============================
  // NOTIFICATIONS
  // ============================

  const { data } = useFetch<NotificationResponse>({
    url: "/notifications",
    key: ["notifications"]
  })

  const notiUnReadData = data?.data?.filter(item => !item.isRead) ?? []

  // ============================
  // UNREAD COUNT
  // ============================

  const { data: unreadData } = useFetch<UnreadCountResponse>({
    url: "/notifications/unread-count",
    key: ["notifications", "unread-count"]
  })

  const notifications = data?.data ?? []
  const notifCount = unreadData?.data.count ?? 0

  // ============================
  // REALTIME
  // ============================

  useEffect(() => {
    const handleNotification = () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"]
      })

      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"]
      })
    }

    socket.on("notification", handleNotification)

    return () => {
      socket.off("notification", handleNotification)
    }
  }, [queryClient])

  // ============================
  // CLICK OUTSIDE
  // ============================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // ============================
  // CLICK NOTIFICATION
  // ============================

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.isRead) {
        await axiosClient.patch(`/notifications/${notification.id}/read`)
      }

      // Update lại data
      queryClient.invalidateQueries({
        queryKey: ["notifications"]
      })

      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"]
      })

      setIsOpen(false)

      // ============================
      // REDIRECT
      // ============================

      if (notification.requestId) {
        navigate(`/request/${notification.requestId}`)
        return
      }

      if (notification.taskId) {
        navigate(`/task/${notification.taskId}`)
        return
      }

      navigate("/my-requests")
    } catch (error) {
      console.error("Không thể xử lý notification:", error)
    }
  }

  // ============================
  // MARK ALL READ
  // ============================

  const handleMarkAllRead = async () => {
    try {
      await axiosClient.patch("/notifications/read-all")

      queryClient.invalidateQueries({
        queryKey: ["notifications"]
      })

      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"]
      })
    } catch (error) {
      console.error("Không thể đánh dấu notification:", error)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="p-2.5 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors relative cursor-pointer"
        title="Thông báo"
      >
        <Bell size={20} />

        {notifCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[1.8rem] h-[1.8rem] flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full px-1">
            {notifCount > 99 ? "99+" : notifCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 w-2xl bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-y-2 px-5 py-4 border-b border-slate-100">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <h3 className="font-semibold text-md text-slate-800">Thông báo</h3>
              {notifCount > 0 && (
                <button onClick={handleMarkAllRead} className="flex items-center gap-1.5 text-2xl text-blue-600 hover:text-blue-700 font-medium">
                  Đọc tất cả
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                className={`px-4 py-2 text-2xl rounded-lg transition-colors ${activeTabNoti === "all" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-blue-50"}`}
                onClick={() => setActiveTabNoti("all")}
              >
                Tất cả
              </button>
              <button
                className={`px-4 py-2 text-2xl rounded-lg transition-colors ${activeTabNoti === "unread" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-blue-50"}`}
                onClick={() => setActiveTabNoti("unread")}
              >
                Chưa đọc
              </button>
            </div>
          </div>

          <div className="max-h-168 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell size={30} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">Không có thông báo</p>
              </div>
            ) : activeTabNoti === "all" ? (
              notifications.map(notification => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    !notification.isRead ? "bg-blue-50/50" : "bg-white"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="pt-1.5 shrink-0">
                      <span className={`block w-2.5 h-2.5 rounded-full ${notification.isRead ? "bg-slate-200" : "bg-blue-500"}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${notification.isRead ? "font-medium text-slate-600" : "font-semibold text-slate-800"}`}>{notification.title}</p>
                      </div>

                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{notification.message}</p>

                      <p className="text-xl text-slate-400 mt-2">{new Date(notification.createdAt).toLocaleString("vi-VN")}</p>
                    </div>
                  </div>
                </button>
              ))
            ) : notiUnReadData.length === 0 ? (
              <div className="py-12 text-center">
                <Bell size={30} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">Không có thông báo</p>
              </div>
            ) : (
              notiUnReadData.map(notification => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    !notification.isRead ? "bg-blue-50/50" : "bg-white"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="pt-1.5 shrink-0">
                      <span className={`block w-2.5 h-2.5 rounded-full ${notification.isRead ? "bg-slate-200" : "bg-blue-500"}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${notification.isRead ? "font-medium text-slate-600" : "font-semibold text-slate-800"}`}>{notification.title}</p>
                      </div>

                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{notification.message}</p>

                      <p className="text-xl text-slate-400 mt-2">{new Date(notification.createdAt).toLocaleString("vi-VN")}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <button
              onClick={() => {
                setIsOpen(false)
                navigate("/my-requests")
              }}
              className="w-full py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Xem tất cả thông báo
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
