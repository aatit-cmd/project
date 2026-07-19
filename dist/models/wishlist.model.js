"use strict";
// product: id, user: id
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// {user:user_id, items[{product:product_id, quantity:number}]}
const mongoose_1 = __importDefault(require("mongoose"));
const wishlistSchema = new mongoose_1.default.Schema({
    userId: {
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
const wishlist = mongoose_1.default.model("wishlist", wishlistSchema);
exports.default = wishlist;
