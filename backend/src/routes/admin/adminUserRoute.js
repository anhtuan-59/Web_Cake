import express from "express";
import {
  getUsers,
  getUserDetail,
  updateUser,
  toggleUserStatus,
  assignRole,
} from "../../controllers/admin/adminUserController.js";

import authMiddleware from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware(["ADMIN"]));

// List users
router.get("/", getUsers);

// User detail
router.get("/:id", getUserDetail);

// Update user info
router.put("/:id", updateUser);

// Lock / unlock user
router.patch("/:id/status", toggleUserStatus);

// Assign role
router.patch("/:id/role", assignRole);

export default router;
