import { axiosClient } from "@/api/axiosClient"
import type { DepartmentListResponse, DepartmentItem } from "@/types/departmentType"

export const departmentService = {
  getAll: () => axiosClient.get<DepartmentListResponse>("/department").then(r => r.data),

  create: (data: Partial<DepartmentItem>) => axiosClient.post("/department", data).then(r => r.data),

  update: (id: string, data: Partial<DepartmentItem>) => axiosClient.patch(`/department/${id}`, data).then(r => r.data),

  delete: (id: string) => axiosClient.delete(`/department/${id}`).then(r => r.data)
}

