import express from "express";
import {
  getProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
  addVariant,
  deleteVariant,
  addProductImage,
} from "../../controllers/admin/adminProductController.js";

import authMiddleware from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware(["ADMIN"]));

// Product
router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", getProductDetail);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// Variant
router.post("/variant", addVariant);
router.delete("/variant/:id", deleteVariant);

// Image
router.post("/image", addProductImage);

export default router;
