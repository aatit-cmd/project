"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brand_controller_1 = require("../controllers/brand.controller");
const auth_middlware_1 = require("../middlewares/auth.middlware");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const enum_types_1 = require("../types/enum.types");
const upload = (0, multer_middleware_1.uploader)();
const router = express_1.default.Router();
//getAll
router.get("/", brand_controller_1.getAll);
//getById
router.get("/:id", brand_controller_1.getById);
//create
// router.post("/",create)
router.post("/", upload.single("logo"), (0, auth_middlware_1.authenticate)(enum_types_1.All_Admin), brand_controller_1.create);
//update
router.put("/:id", upload.single("logo"), (0, auth_middlware_1.authenticate)(enum_types_1.All_Admin), brand_controller_1.update);
//delete
router.delete("/:id", (0, auth_middlware_1.authenticate)(enum_types_1.All_Admin), brand_controller_1.remove);
exports.default = router;
