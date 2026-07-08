import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/category.controller";

const router = express.Router();

//* get all category
router.get("/", getAll);

//* get by id
router.get("/:id", getById);

//* create/post
router.post("/", create);

//* update/put
router.put("/:id", update);

//* delete
router.delete("/:id", remove);

export default router;
