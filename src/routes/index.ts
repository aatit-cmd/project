import express from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import brandRoutes from "./brand.routes"

const router = express.Router();

router.use("/auth",authRoutes);
router.use("/users", userRoutes);
router.use("/brands",brandRoutes);

export default router;
