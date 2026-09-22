import { Router } from "express"
import { RequestController } from "../controllers/request.controller.js"
import { requireRole, verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()
const requestController = new RequestController()
router.use(verifyToken)

router.get("/request", requireRole("ADMIN", "MANAGER"), requestController.getRequest)
router.get("/request/manager", requireRole("MANAGER", "ADMIN"), requestController.getManagedRequests)
router.get("/request/stats", requestController.getRequestStats)
router.get("/request/user", requestController.getUserRequest)
router.get("/request/:id", requireRole("MANAGER", "ADMIN"), requestController.getDetailRequest)
router.post("/request", requestController.createRequest)
router.patch("/request/:id/review", requireRole("MANAGER", "ADMIN"), requestController.reviewRequest)
router.patch("/request/:id", requestController.updateRequest)
router.delete("/request/:id", requireRole("ADMIN", "MANAGER"), requestController.deleteRequest)
export default router
