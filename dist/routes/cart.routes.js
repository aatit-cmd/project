"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middlware_1 = require("../middlewares/auth.middlware");
const router = (0, express_1.Router)();
router.get("/", (0, auth_middlware_1.authenticate)(), cart_controller_1.viewCart);
router.post("/", (0, auth_middlware_1.authenticate)(), cart_controller_1.addToCart);
exports.default = router;
