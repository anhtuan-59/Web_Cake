import authMiddleware from "./authMiddleware.js";

const adminMiddleware = (roles = ["ADMIN", "STAFF"]) => {
  return [
    authMiddleware,
    (req, res, next) => {
      // kiểm tra user có tồn tại không
      if (!req.user) {
        return res.status(401).json({ message: "Chưa xác thực người dùng" });
      }

      // log ra để debug
      console.log("USER:", req.user);
      console.log("ROLE:", req.user.role);

      // kiểm tra quyền
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Không có quyền admin" });
      }
      next();
    },
  ];
};

export default adminMiddleware;
