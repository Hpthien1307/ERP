import { Router } from "express"
import { PositionController } from "../controllers/position.controller.js"
import { requireRole, verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()
const positionController = new PositionController()
router.use(verifyToken)

router.get("/position", requireRole("ADMIN"), positionController.getPosition)
router.get("/position/:id", requireRole("MANAGER"), positionController.getDetailPosition)
router.post("/position", requireRole("ADMIN"), positionController.createPosition)
router.put("/position/:id", requireRole("MANAGER"), positionController.updatePosition)
router.patch("/position/:id", requireRole("MANAGER"), positionController.updatePosition)
router.delete("/position/:id", requireRole("ADMIN"), positionController.deletePosition)

export default router
