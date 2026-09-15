import { Router } from "express"
import { RequestController } from "../controllers/request.controller.js"
import { requireRole, verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()
const requestController = new RequestController()
router.use(verifyToken)

router.get("/request", requireRole("ADMIN"), requestController.getRequest)
router.get("/request/manager", requireRole("MANAGER", "ADMIN"), requestController.getManagedRequests)
router.get("/request/:id", requireRole("MANAGER", "ADMIN"), requestController.getDetailRequest)
router.get("/request/user/:userId", requestController.getUserRequest)
router.post("/request", requestController.createRequest)
router.patch("/request/:id/review", requireRole("MANAGER", "ADMIN"), requestController.reviewRequest)
router.patch("/request/:id", requestController.updateRequest)
router.delete("/request/:id", requireRole("ADMIN", "MANAGER"), requestController.deleteRequest)
export default router
