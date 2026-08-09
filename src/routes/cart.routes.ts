import { Router } from "express";
import { addToCart, viewCart } from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middlware";

const router = Router();

router.get("/", authenticate(), viewCart);

router.post("/", authenticate(), addToCart);

export default router;
