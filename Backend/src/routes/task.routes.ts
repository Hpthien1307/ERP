import { Router } from "express"
import { TaskController } from "../controllers/task.controller.js"
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js"

const router = Router()
const taskController = new TaskController()
router.use(verifyToken)

router.get("/task", taskController.getTask)
router.get("/task/:id", taskController.getDetailTask)
router.post("/task", requireRole("MANAGER", "ADMIN"), taskController.createTask)
router.patch("/task/:id", requireRole("MANAGER", "ADMIN"), taskController.updateTask)
router.delete("/task/:id", requireRole("ADMIN"), taskController.deleteTask)

export default router
