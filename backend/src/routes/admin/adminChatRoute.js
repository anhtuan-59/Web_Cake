import express from "express";
import adminMiddleware from "../../middlewares/adminMiddleware.js";

import {
  getAllChats,
  getChatDetail,
  sendAdminMessage,
  closeChat,
} from "../../controllers/admin/adminChatController.js";

const router = express.Router();

// Chỉ cần admin đăng nhập
router.use(adminMiddleware(["ADMIN"]));

router.get("/", getAllChats);
router.get("/:id", getChatDetail);
router.post("/:id/message", sendAdminMessage);
router.put("/:id/close", closeChat);

export default router;
