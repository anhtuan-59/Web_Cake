// Xem danh sách user (phân trang, search)
// Xem chi tiết 1 user
// Khóa / mở khóa 1 user
// Cập nhật thông tin user
// Xóa user
// Gán role cho user
// Xem lịch sử đơn hàng của user
// Xem tổng tiền user đã mua (cho thống kê)

import User from "../../models/User.js";
import UserRole from "../../models/UserRole.js";
import Role from "../../models/Role.js";
import Order from "../../models/Order.js";

// GET LIST USERS (pagination + search)
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword = "" } = req.query;

    const query = {
      fullName: { $regex: keyword, $options: "i" },
    };

    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      data: users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("getUsers error:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// GET USER DETAIL
export const getUserDetail = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    const userRole = await UserRole.findOne({ user: userId }).populate("role");

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.json({
      user,
      role: userRole?.role?.name,
      orders,
      totalSpent,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// UPDATE USER INFO (ADMIN)
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullName, phone, status } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { fullName, phone, status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.json({ message: "Cập nhật user thành công", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// LOCK / UNLOCK USER
export const toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    user.status = user.status === "active" ? "blocked" : "active";
    await user.save();

    res.json({
      message: `User đã được ${user.status === "blocked" ? "khóa" : "mở khóa"}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// ASSIGN ROLE TO USER
export const assignRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { roleName } = req.body;

    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(404).json({ message: "Role không tồn tại" });
    }

    await UserRole.findOneAndUpdate(
      { user: userId },
      { role: role._id },
      { upsert: true }
    );

    res.json({ message: "Gán role thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
