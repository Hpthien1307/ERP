import { axiosClient } from "@/api/axiosClient"
import type { PositionItem, PositionResponse } from "@/types/positionType"

export const positionService = {
  getAll: () => axiosClient.get<PositionResponse>("/position").then(r => r.data),

  create: (data: PositionItem) => axiosClient.post("/position", data).then(r => r.data),

  update: (id: string, data: PositionItem) => axiosClient.put(`/position/${id}`, data).then(r => r.data),

  delete: (id: string) => axiosClient.delete(`/position/${id}`).then(r => r.data)
}
