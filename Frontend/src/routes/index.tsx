import Login from "@/pages/auth/siginIn"
import Attendance from "@/pages/attendance/attendance"
import Dashboard from "@/pages/dashboard/dashboard"
import Profile from "@/pages/profile/profile"
import Requests from "@/pages/requests/request"
import Tasks from "@/pages/tasks/tasks"

type RouteConfig = {
  path: string
  component: React.ComponentType
}

const publicRoutes: RouteConfig[] = [
  {
    path: "/login",
    component: Login
  }
]

const privateRoutes: RouteConfig[] = [
  {
    path: "/attendance",
    component: Attendance
  },
  {
    path: "/dashboard",
    component: Dashboard
  },
  {
    path: "/profile",
    component: Profile
  },
  {
    path: "/my-requests",
    component: Requests
  },
  {
    path: "/my-tasks",
    component: Tasks
  }
]

export { publicRoutes, privateRoutes }
