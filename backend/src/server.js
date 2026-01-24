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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares ==> giúp express hiểu và đọc req body dưới dạng Json
app.use(express.json());
app.use(cookieParser());

// public routes
app.use("/api/auth", authRoute);

// private routes
app.use(protectedRoute);
app.use("/api/users", userRoute);

// adminAuth routes
app.use("/api/admin/auth", adminAuthRoutes);

// adminUser routes
app.use("/api/admin/users", adminUserRoutes);

// adminProduct routes
app.use("/api/admin/products", adminProductRoutes);

// adminCategory routes
app.use("/api/admin/categories", adminCategoryRoutes);

// adminOrder routes
app.use("/api/admin/orders", adminOrderRoutes);

// adminCustomCake routes
app.use("/api/admin/custom-cakes", adminCustomCakeRoutes);

// adminChat routes
app.use("/api/admin/chats", adminChatRoutes);

//adminDashboard routes
app.use("/api/admin/dashboards", adminDashboardRoutes);

// product routes
app.use("/api/products", productRoutes);

// category routes
app.use("./api/categories", categoryRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
