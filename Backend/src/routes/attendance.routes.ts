import { Router } from "express"
import { AttendanceController } from "../controllers/attendance.controller.js"
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js"

const router = Router()
const controller = new AttendanceController()

router.use(verifyToken)

// Các route cá nhân
router.post("/attendance/check-in", controller.checkIn)
router.post("/attendance/check-out", controller.checkOut)
router.get("/attendance/me", controller.getMyAttendance)

// Route quản lý (Admin / Manager)
router.get("/attendance", requireRole("ADMIN", "MANAGER"), controller.getAll)

export default router
