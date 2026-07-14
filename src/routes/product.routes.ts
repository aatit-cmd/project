import express from "express";
import { create, getAll, getById } from "../controllers/product.controller";
import { uploader } from "../middlewares/multer.middleware";

const router = express.Router();

const upload = uploader();
router.get("/", getAll);
router.get("/:id", getById);
router.post("/create", upload.single("cover_image"), create);

export default router;
