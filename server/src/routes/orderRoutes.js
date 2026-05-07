import { Router } from "express";
import {
  createOrder,
  createPaymentOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/payment-order", requireAuth, createPaymentOrder);
router.post("/", requireAuth, createOrder);
router.get("/mine", requireAuth, getMyOrders);
router.get("/", requireAuth, requireRole("admin"), getAllOrders);
router.patch("/:id", requireAuth, requireRole("admin", "cr"), updateOrderStatus);

export default router;
