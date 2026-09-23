import { Router } from "express"
import { DepartmentController } from "../controllers/department.controller.js"
import { requireRole, verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()
const departmentController = new DepartmentController()
router.use(verifyToken)

router.get("/department/", requireRole("ADMIN"), departmentController.getDp)
router.get("/department/:id", requireRole("MANAGER"), departmentController.getDetailDp)
router.post("/department", requireRole("ADMIN"), departmentController.createDp)
router.patch("/department/:id", requireRole("MANAGER"), departmentController.updateDp)
router.delete("/department/:id", requireRole("ADMIN"), departmentController.deleteDp)

export default router
