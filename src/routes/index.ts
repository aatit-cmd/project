import express from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import brandRoutes from "./brand.routes";
import categoryRoutes from "./category.routes";
import productRoutes from "./product.routes"
import wishlistRoutes from "../routes/wishlist.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/brands", brandRoutes);
router.use("/categories", categoryRoutes);
router.use("/product",productRoutes)
router.use("/wishlists",wishlistRoutes)

export default router;
