import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { employeeService } from "@/service/employeeService"
import type { EmployeeFormValidation } from "@/validators/employeeValidation"
import type { EmployeeListParams } from "@/types/employeesType"

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const employeeKeys = {
  all: ["employees"] as const,
  list: (params: EmployeeListParams) => ["employees", params] as const
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useEmployees = (params: EmployeeListParams) =>
  useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => employeeService.getAll(params),
    staleTime: 1000 * 60
  })

export const useCreateEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: EmployeeFormValidation) => employeeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    }
  })
}

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeFormValidation> }) => employeeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    }
  })
}

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => employeeService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    }
  })
}
