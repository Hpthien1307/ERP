import { axiosClient } from "@/api/axiosClient"
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query"
import { showToast } from "@/components/ui/toast"
import type { AxiosError } from "axios"

interface UseUpdateProps {
  url: string
  invalidateKey?: QueryKey
  successMessage?: string
  isMultipart?: boolean
}

interface ApiErrorResponse {
  message?: string
}

interface UpdatePayload<T> {
  id: string | number
  data: T
  subPath?: string // ví dụ "review" -> /request/:id/review
}

export const useUpdate = <T>({ url: endpoint, invalidateKey, successMessage = "", isMultipart = false }: UseUpdateProps) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data, subPath }: UpdatePayload<T>) => {
      const path = subPath ? `${endpoint}/${id}/${subPath}` : `${endpoint}/${id}`
      const res = await axiosClient.patch(path, data, {
        headers: isMultipart ? { "Content-Type": "multipart/form-data" } : {}
      })
      return res.data
    },
    onSuccess: () => {
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: invalidateKey })
      }
      showToast.success(successMessage)
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error.response?.data?.message || "Cập nhật thất bại!"
      showToast.error(message)
    }
  })
}
