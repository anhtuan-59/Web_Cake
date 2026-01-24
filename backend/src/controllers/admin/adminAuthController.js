// Admin vẫn là user, chỉ khác là :
// Có Role = admin hoặc staff
// Dùng route /api/admin riêng
// Sẽ bị chặn bởi adminMiddleware

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import UserRole from "../../models/UserRole.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

// ADMIN LOGIN
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user tồn tại
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "Tài khoản đã bị khóa" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Check role
    const userRole = await UserRole.findOne({ user: user._id }).populate(
      "role"
    );

    if (!userRole || !["ADMIN", "STAFF"].includes(userRole.role.name)) {
      return res.status(403).json({ message: "Không có quyền admin" });
    }

    // Tạo access token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: userRole.role.name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Đăng nhập admin thành công",
      accessToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: userRole.role.name,
      },
    });
  } catch (error) {
    console.error("adminLogin error:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// ADMIN ME (protected)
export const adminMe = [
  authMiddleware,
  async (req, res) => {
    if (!["ADMIN", "STAFF"].includes(req.user.role)) {
      return res.status(403).json({ message: "Không có quyền admin" });
    }

    res.json({ user: req.user });
  },
];

// ADMIN LOGOUT (JWT stateless)
export const adminLogout = async (req, res) => {
  res.json({ message: "Đăng xuất admin thành công" });
};
