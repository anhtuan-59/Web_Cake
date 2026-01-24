import Chat from "../../models/Chat.js";
import Message from "../../models/Message.js";

// GET /admin/chats (Xem danh sách chat)
export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate("customer", "fullName email phone")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error("getAllChats error:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// GET /admin/chats/:id (Xem chi tiết chat + tin nhắn)
export const getChatDetail = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate(
      "customer",
      "fullName email phone"
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat không tồn tại" });
    }

    const messages = await Message.find({ chat: chat._id })
      .populate("sender", "fullName")
      .sort({ createdAt: 1 });

    res.json({
      chat,
      messages,
    });
  } catch (error) {
    console.error("getChatDetail error:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// POST /admin/chats/:id/message (Admin gửi tin nhắn cho khách)
export const sendAdminMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Nội dung tin nhắn rỗng" });
    }

    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: "Chat không tồn tại" });
    }

    if (chat.status === "closed") {
      return res
        .status(400)
        .json({ message: "Chat đã đóng, không thể gửi thêm" });
    }

    const newMessage = new Message({
      chat: chat._id,
      sender: req.user._id, // admin
      message,
      type: "text",
    });

    await newMessage.save();

    chat.updatedAt = new Date();
    await chat.save();

    res.json({ message: "Đã gửi tin nhắn" });
  } catch (error) {
    console.error("sendAdminMessage error:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// PUT /admin/chats/:id/close (Đóng chat)
export const closeChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: "Chat không tồn tại" });
    }

    chat.status = "closed";
    await chat.save();

    res.json({ message: "Đã đóng chat" });
  } catch (error) {
    console.error("closeChat error:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
