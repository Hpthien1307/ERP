import { Router } from "express"
import { UserController } from "../controllers/user.controller.js"
import { requireRole, verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()
const userController = new UserController()
router.use(verifyToken)

router.get("/users", requireRole("ADMIN"), userController.getUser)
router.get("/users/:id", requireRole("ADMIN", "MANAGER"), userController.getDetailUser)
router.post("/users", requireRole("ADMIN"), userController.createUser)
router.patch("/users/:id", requireRole("ADMIN"), userController.updateUser)
router.delete("/users/:id", requireRole("ADMIN"), userController.deleteUser)

export default router
