import { Router } from "express";
import { create, getAll } from "../controllers/wishlist.controller";
import { authenticate } from "../middlewares/auth.middlware";

const router = Router();

router.get("/", getAll);

router.post("/", authenticate(),create);

export default router;
