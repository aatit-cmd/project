import express from "express";
import {
  create,
  getAll,
  getAllFeaturedProducts,
  getAllNewArrivals,
  getByBrand,
  getByCategory,
  getById,
  remove,
  update,
} from "../controllers/product.controller";
import { uploader } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middlware";
import { All_Admin, User_Only } from "../types/enum.types";

const router = express.Router();

const upload = uploader();

// get_all
router.get("/", getAll);

// get all new arrival
router.get("/new-arrival", getAllNewArrivals);

// get all featured
router.get("/featured", getAllFeaturedProducts);

// get by id
router.get("/:id", getById);

// create
router.post(
  "/",
  authenticate(All_Admin),
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  create,
);

// update
router.put(
  "/:id",
  authenticate(All_Admin),
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  update,
);

router.delete("/:id", remove);

router.get("/category/:categoryId", getByCategory);

router.get("/brands/:brandId", getByBrand);

export default router;
