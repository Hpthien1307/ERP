import { axiosClient } from "@/api/axiosClient"
import type { SignInType } from "@/types/signInType"

export const authService = {
  signIn: async (data: SignInType) => {
    const response = await axiosClient.post("/auth/signin", data)
    return response.data.data
  },
  checkAuth: async () => {
    const response = await axiosClient.get("/auth/getMe")
    return response.data.data
  }
}
