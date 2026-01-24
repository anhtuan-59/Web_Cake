import express from "express";
import {
  createCategory,
  getAllCategoriesAdmin,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "../../controllers/admin/adminCategoryController.js";

import adminMiddleware from "../../middlewares/adminMiddleware.js";

const router = express.Router();

// chỉ ADMIN & STAFF mới vào được
router.use(adminMiddleware(["ADMIN", "STAFF"]));

router.post("/", createCategory);
router.get("/", getAllCategoriesAdmin);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.patch("/:id/toggle", toggleCategoryStatus);

export default router;
