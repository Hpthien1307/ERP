export type DashboardStatsResponse = {
  message: string
  data: {
    attendance: { onTime: number; late: number; absent: number; avgWorkingHours: number }
    task: { total: number; todo: number; inProgress: number; inReview: number; completed: number; overDue: number }
    request: { total: number; pending: number; approved: number; rejected: number }
  }
}

export type EmployeeOption = {
  id: string
  fullName: string
  department: { title: string } | null
}
