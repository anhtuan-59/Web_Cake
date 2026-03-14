import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";

import adminAuthRoutes from "./routes/admin/adminAuthRoute.js";
import adminUserRoutes from "./routes/admin/adminUserRoute.js";
import adminProductRoutes from "./routes/admin/adminProductRoute.js";
import adminCategoryRoutes from "./routes/admin/adminCategoryRoute.js";
import adminOrderRoutes from "./routes/admin/adminOrderRoute.js";
import adminCustomCakeRoutes from "./routes/admin/adminCustomCakeRoute.js";
import adminChatRoutes from "./routes/admin/adminChatRoute.js";
import adminDashboardRoutes from "./routes/admin/adminDashboardRoute.js";

import productRoutes from "./routes/productRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import cartRoutes from "./routes/cartRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import customCakeRoutes from "./routes/customCakeRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import vnpayRoutes from "./routes/vnpayRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares ==> giúp express hiểu và đọc req body dưới dạng Json
app.use(express.json());
app.use(cookieParser());

/* ========================
   PUBLIC ROUTES (KHÔNG cần token)
======================== */

// user auth
app.use("/api/auth", authRoute);

// admin login / logout / me
app.use("/api/admin/auth", adminAuthRoutes);

// xem sản phẩm, category (public)
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// vnpay callback (thường public)
app.use("/api/payments/vnpay", vnpayRoutes);

/* ========================
   PROTECTED USER ROUTES (cần token user)
======================== */

app.use("/api/users", protectedRoute, userRoute);
app.use("/api/carts", protectedRoute, cartRoutes);
app.use("/api/orders", protectedRoute, orderRoutes);
app.use("/api/custom-cakes", protectedRoute, customCakeRoutes);
app.use("/api/payments", protectedRoute, paymentRoutes);
app.use("/api/reviews", protectedRoute, reviewRoutes);

/* ========================
   ADMIN ROUTES 
   (đã có authMiddleware + adminMiddleware bên trong từng route)
======================== */

app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/custom-cakes", adminCustomCakeRoutes);
app.use("/api/admin/chats", adminChatRoutes);
app.use("/api/admin/dashboards", adminDashboardRoutes);

/* ========================
   START SERVER
======================== */

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
