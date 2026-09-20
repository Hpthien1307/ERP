import { axiosClient } from "@/api/axiosClient"
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query"
import { showToast } from "@/components/ui/toast"
import type { AxiosError } from "axios"

interface UseDeleteProps {
  url: string
  invalidateKey?: QueryKey
  successMessage?: string
}

interface ApiErrorResponse {
  message?: string
}

export const useDelete = ({ url: endpoint, invalidateKey, successMessage = "" }: UseDeleteProps) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await axiosClient.delete(`${endpoint}/${id}`)
      return res.data
    },
    onSuccess: () => {
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: invalidateKey })
      }
      if (successMessage) {
        showToast.success(successMessage)
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error.response?.data?.message || "Xóa thất bại!"
      showToast.error(message)
    }
  })
}
