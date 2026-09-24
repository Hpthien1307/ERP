import { create } from "zustand"
import { axiosClient } from "@/api/axiosClient"
import type { UserState } from "@/types/globalType"
import { showToast } from "@/components/ui/toast"
import { authService } from "@/service/authService"

type AuthState = {
  user: UserState | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuth = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // 1. Đăng nhập: Backend tự gửi Header Set-Cookie chứa accessToken/refreshToken
  signIn: async (email, password) => {
    try {
      set({ isLoading: true })

      await authService.signIn({ email, password })
      const userData = await authService.checkAuth()

      set({
        user: userData,
        isAuthenticated: true
      })
      showToast.success("Đăng nhập thành công")
    } catch (error) {
      console.error(error)
      showToast.error("Tài khoản hoặc mật khẩu không đúng")
      set({ isAuthenticated: false })
    } finally {
      set({ isLoading: false })
    }
  },

  // 2. Kiểm tra phiên đăng nhập (chạy khi F5 hoặc lần đầu vào web)
  checkAuth: async () => {
    try {
      set({ isLoading: true })
      const userData = await authService.checkAuth()
      set({
        user: userData,
        isAuthenticated: true
      })
    } catch {
      // Cookie hết hạn hoặc người dùng chưa đăng nhập (401)
      set({
        user: null,
        isAuthenticated: false
      })
    } finally {
      set({ isLoading: false })
    }
  },

  // 3. Đăng xuất: Báo backend xóa Cookie và reset state frontend
  signOut: async () => {
    try {
      set({ isLoading: true })
      await axiosClient.post("/auth/signout")
    } catch (err) {
      console.error("Lỗi đăng xuất:", err)
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
  }
}))
