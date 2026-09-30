import { departmentService } from "@/service/departmentService"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { DepartmentItem } from "@/types/departmentType"

export const departmentKeys = {
  all: ["department"] as const
}

export const useDepartment = (enabledProps?: boolean) => {
  return useQuery({
    queryKey: departmentKeys.all,
    queryFn: () => departmentService.getAll(),
    enabled: enabledProps
  })
}

export const useCreateDepartment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<DepartmentItem>) => departmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
    }
  })
}

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { id: string; data: Partial<DepartmentItem> }) => departmentService.update(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
    }
  })
}

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => departmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
    }
  })
}

