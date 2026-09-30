import { axiosClient } from "@/api/axiosClient"
import type { EmployeeListParams, EmployeeListResponse } from "@/types/employeesType"
import type { EmployeeFormValidation } from "@/validators/employeeValidation"

export const employeeService = {
  getAll: (params: EmployeeListParams) => axiosClient.get<EmployeeListResponse>("/users", { params }).then(r => r.data),

  create: (data: EmployeeFormValidation) => axiosClient.post("/users", data).then(r => r.data),

  update: (id: string, data: Partial<EmployeeFormValidation>) => axiosClient.patch(`/users/${id}`, data).then(r => r.data),

  remove: (id: string) => axiosClient.delete(`/users/${id}`).then(r => r.data)
}
