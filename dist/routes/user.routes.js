"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
//* get all 
router.get("/", user_controller_1.getAll);
//* get all admin
router.get("/admins", user_controller_1.getAllAdmins);
//* getById
router.get("/:id", user_controller_1.getById);
exports.default = router;
