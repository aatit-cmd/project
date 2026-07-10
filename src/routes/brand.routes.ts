import express from "express";
import { create, getAll, getById, remove, update } from "../controllers/brand.controller";

import { uploader } from "../middlewares/multer.middleware";
const upload = uploader();

const router = express.Router();

//getAll
router.get("/",getAll);

//getById
router.get("/:id",getById);

//create
// router.post("/",create)
router.post("/",upload.single("logo"),create);

//update
router.put("/:id",upload.single("logo"),update)

//delete
router.delete("/:id",remove)

export default router;