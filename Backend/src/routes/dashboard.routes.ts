// routes/dashboard.routes.ts
import { Router } from "express"
import { DashboardController } from "../controllers/dashboard.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()
const dashboardController = new DashboardController()

router.use(verifyToken)
router.get("/dashboard/stats", dashboardController.getStats)
router.get("/dashboard/employees", dashboardController.getFilterableEmployees)

export default router
