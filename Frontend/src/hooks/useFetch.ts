import { useQuery } from "@tanstack/react-query"
import type { UseQueryOptions, QueryKey } from "@tanstack/react-query"
import type { AxiosRequestConfig } from "axios"
import { axiosClient } from "@/api/axiosClient"

interface UseFetchProps<T> {
  url: string
  key: QueryKey
  enabled?: boolean
  params?: AxiosRequestConfig["params"] // Hỗ trợ truyền Query Params (filter, page...)
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn" | "enabled">
}

const useFetch = <T>({ url, key, enabled = true, params, options }: UseFetchProps<T>) => {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const res = await axiosClient.get<T>(url, { params })
      return res.data
    },
    staleTime: 1000 * 60 * 1, // Cache data trong 1 phút
    enabled,
    ...options
  })
}

export default useFetch
