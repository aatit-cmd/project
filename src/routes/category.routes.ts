import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/category.controller";
import { uploader } from "../middlewares/multer.middleware";
import { All_Admin } from "../types/enum.types";
import { authenticate } from "../middlewares/auth.middlware";

const router = express.Router();

const upload = uploader();

//* get all category
router.get("/", getAll);

//* get by id
router.get("/:id", getById);

//* create/post
router.post("/",upload.single("logo"), authenticate(All_Admin),create);

//* update/put
router.put("/:id",upload.single("logo"),authenticate(All_Admin) ,update);

//* delete
router.delete("/:id",authenticate(All_Admin), remove);

export default router;
