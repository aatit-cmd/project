import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/category.controller";
import { uploader } from "../middlewares/multer.middleware";

const router = express.Router();

const upload = uploader();

//* get all category
router.get("/", getAll);

//* get by id
router.get("/:id", getById);

//* create/post
router.post("/",upload.single("logo"), create);

//* update/put
router.put("/:id",upload.single("logo"), update);

//* delete
router.delete("/:id", remove);

export default router;
