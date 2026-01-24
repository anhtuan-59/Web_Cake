import express from "express";
import adminMiddleware from "../../middlewares/adminMiddleware.js";

import {
  getAllOrders,
  getOrderDetail,
  updateOrderStatus,
  cancelOrder,
  getOrderStatistics,
} from "../../controllers/admin/adminOrderController.js";

const router = express.Router();

// Tất cả route đều cần quyền ADMIN / STAFF
router.use(adminMiddleware(["ADMIN", "STAFF"]));

router.get("/", getAllOrders);
router.get("/statistics", getOrderStatistics);
router.get("/:id", getOrderDetail);
router.put("/:id/status", updateOrderStatus);
router.put("/:id/cancel", cancelOrder);

export default router;
