"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const enum_types_1 = require("../types/enum.types");
const auth_middlware_1 = require("../middlewares/auth.middlware");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploader)();
//* get all category
router.get("/", category_controller_1.getAll);
//* get by id
router.get("/:id", category_controller_1.getById);
//* create/post
router.post("/", upload.single("logo"), (0, auth_middlware_1.authenticate)(), category_controller_1.create);
//* update/put
router.put("/:id", upload.single("logo"), (0, auth_middlware_1.authenticate)(enum_types_1.All_Admin), category_controller_1.update);
//* delete
router.delete("/:id", (0, auth_middlware_1.authenticate)(enum_types_1.All_Admin), category_controller_1.remove);
exports.default = router;
