import express from "express";
import adminMiddleware from "../../middlewares/adminMiddleware.js";
import { getAdminDashboard } from "../../controllers/admin/adminDashboardController.js";

const router = express.Router();

// Chỉ admin
router.use(adminMiddleware(["ADMIN"]));

router.get("/", getAdminDashboard);

export default router;
