import express from "express";
import {
  getProducts,
  getProductDetail,
  getProductsByCategory,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductDetail);
router.get("/category/:slug", getProductsByCategory);

export default router;
