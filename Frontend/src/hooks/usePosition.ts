import { positionService } from "@/service/positionService"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { PositionItem } from "@/types/positionType"

export const positionKeys = {
  all: ["position"] as const
}

export const usePosition = (enabledProps?: boolean) => {
  return useQuery({
    queryKey: positionKeys.all,
    queryFn: () => positionService.getAll(),
    enabled: enabledProps
  })
}

export const useCreatePosition = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PositionItem) => positionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: positionKeys.all })
    }
  })
}

export const useUpdatePosition = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { id: string; data: PositionItem }) => positionService.update(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: positionKeys.all })
    }
  })
}

export const useDeletePosition = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => positionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: positionKeys.all })
    }
  })
}
