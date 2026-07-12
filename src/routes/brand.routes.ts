import express from "express";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/brand.controller";
import { authenticate } from "../middlewares/auth.middlware";
import { uploader } from "../middlewares/multer.middleware";
import { All_Admin } from "../types/enum.types";

const upload = uploader();

const router = express.Router();

//getAll
router.get("/", getAll);

//getById
router.get("/:id", getById);

//create
// router.post("/",create)
router.post("/", upload.single("logo"), authenticate(All_Admin), create);

//update
router.put("/:id", upload.single("logo"), authenticate(All_Admin), update);

//delete
router.delete("/:id", authenticate(All_Admin), remove);

export default router;
