import express from "express";
import adminMiddleware from "../../middlewares/adminMiddleware.js";

import {
  getAllCustomCakeRequests,
  getCustomCakeDetail,
  quoteCustomCake,
  rejectCustomCake,
  completeCustomCake,
} from "../../controllers/admin/adminCustomCakeController.js";

const router = express.Router();

// ADMIN / STAFF
router.use(adminMiddleware(["ADMIN", "STAFF"]));

router.get("/", getAllCustomCakeRequests);
router.get("/:id", getCustomCakeDetail);

router.put("/:id/quote", quoteCustomCake);
router.put("/:id/reject", rejectCustomCake);
router.put("/:id/complete", completeCustomCake);

export default router;
