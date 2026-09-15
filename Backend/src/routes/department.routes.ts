import { Router } from "express"
import { DepartmentController } from "../controllers/department.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()
const departmentController = new DepartmentController()
router.use(verifyToken)

router.get("/department/", departmentController.getDp)
router.get("/department/:id", departmentController.getDetailDp)
router.post("/department", departmentController.createDp)
router.put("/department/:id", departmentController.updateDp)
router.delete("/department/:id", departmentController.deleteDp)

export default router
