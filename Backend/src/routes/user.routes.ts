import { Router } from "express"
import { UserController } from "../controllers/user.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()
const userController = new UserController()
router.use(verifyToken)

router.get("/users", userController.getUser)
router.get("/users/:id", userController.getDetailUser)
router.post("/users", userController.createUser)
router.patch("/users/:id", userController.updateUser)
router.delete("/users/:id", userController.deleteUser)

export default router
