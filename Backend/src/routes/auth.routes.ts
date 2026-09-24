import { Router } from "express"
import { AuthController } from "../controllers/auth.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const authRouter = Router()
const authController = new AuthController()

authRouter.post("/signin", authController.signin)
authRouter.post("/signout", verifyToken, authController.signout)
authRouter.get("/getMe", verifyToken, authController.getMe)
authRouter.post("/refresh-token", authController.refreshToken)

export default authRouter
