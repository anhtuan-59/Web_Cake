import authMiddleware from "./authMiddleware.js";

const adminMiddleware = (roles = ["ADMIN", "STAFF"]) => {
  return [
    authMiddleware,
    (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Không có quyền admin" });
      }
      next();
    },
  ];
};

export default adminMiddleware;
