import { axiosClient } from "@/api/axiosClient"
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query"
import { showToast } from "@/utils/toast"
import type { AxiosError } from "axios"

interface UseCreateProps {
  url: string
  invalidateKey?: QueryKey
  successMessage?: string
  isMultipart?: boolean
}

interface ApiErrorResponse {
  message?: string
}

export const useCreate = <T>({ url: endpoint, invalidateKey, successMessage = "", isMultipart = false }: UseCreateProps) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: T) => {
      const res = await axiosClient.post(endpoint, data, {
        headers: isMultipart ? { "Content-Type": "multipart/form-data" } : {}
      })
      return res.data
    },
    onSuccess: () => {
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: invalidateKey })
        console.log("Đã gọi invalidateQueries")
      }
      showToast.success(successMessage)
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error.response?.data?.message || "Thêm mới thất bại!"
      showToast.error(message)
    }
  })
}
