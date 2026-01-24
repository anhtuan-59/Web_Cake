import express from "express";
import {
  adminLogin,
  adminMe,
  adminLogout,
} from "../../controllers/admin/adminAuthController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js";

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

// Lấy thông tin admin hiện tại
router.get("/me", authMiddleware, adminMiddleware(), adminMe);

// Logout
router.post("/logout", authMiddleware, adminMiddleware(), adminLogout);

export default router;
