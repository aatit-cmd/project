"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const auth_middlware_1 = require("../middlewares/auth.middlware");
const router = (0, express_1.Router)();
router.get("/", wishlist_controller_1.getAll);
router.post("/", (0, auth_middlware_1.authenticate)(), wishlist_controller_1.create);
exports.default = router;
