import { Router } from "express"
import { PositionController } from "../controllers/position.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()
const positionController = new PositionController()
router.use(verifyToken)

router.get("/position", positionController.getPosition)
router.get("/position/:id", positionController.getDetailPosition)
router.post("/position", positionController.createPosition)
router.put("/position/:id", positionController.updatePosition)
router.patch("/position/:id", positionController.updatePosition)
router.delete("/position/:id", positionController.deletePosition)

export default router
