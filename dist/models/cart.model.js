"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user_id is required"],
    },
    items: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "product_id is required"],
            },
            quantity: {
                type: Number,
                required: [true, "quantity is required"],
                minLength: [1, "quantity cannot be less than 1"],
                default: 1,
            },
        },
    ],
}, { timestamps: true });
const cart = mongoose_1.default.model("cart", cartSchema);
exports.default = cart;
