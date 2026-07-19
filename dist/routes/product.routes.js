"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const auth_middlware_1 = require("../middlewares/auth.middlware");
const enum_types_1 = require("../types/enum.types");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploader)();
// get_all
router.get("/", product_controller_1.getAll);
// get all new arrival
router.get("/new-arrival", product_controller_1.getAllNewArrivals);
// get all featured
router.get("/featured", product_controller_1.getAllFeaturedProducts);
// get by id
router.get("/:id", product_controller_1.getById);
// create
router.post("/", (0, auth_middlware_1.authenticate)(enum_types_1.All_Admin), upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "images", maxCount: 5 },
]), product_controller_1.create);
// update
router.put("/:id", (0, auth_middlware_1.authenticate)(enum_types_1.All_Admin), upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "images", maxCount: 5 },
]), product_controller_1.update);
router.delete("/:id", product_controller_1.remove);
router.get("/category/:categoryId", product_controller_1.getByCategory);
router.get("/brands/:brandId", product_controller_1.getByBrand);
exports.default = router;
