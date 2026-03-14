import express from "express";
import {
  createVNPayPayment,
  vnpayIPN,
} from "../controllers/vnpayPaymentController.js";

const router = express.Router();

router.get("/:orderId", createVNPayPayment);
router.get("/ipn", vnpayIPN);

export default router;
