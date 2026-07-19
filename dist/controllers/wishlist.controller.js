"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.getAll = void 0;
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const wishlist_model_1 = __importDefault(require("../models/wishlist.model"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const wishlist = await wishlist_model_1.default.find().populate({
        path: "items.productId",
        select: "name price cover_image brand description",
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "wishlist is fetched",
        statuscode: 200,
        data: wishlist,
    });
});
exports.create = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user?._id;
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
        throw new appError_utils_1.default("Product ID is required", 400);
    }
    let wishlist = await wishlist_model_1.default.findOne({ userId });
    if (!wishlist) {
        wishlist = new wishlist_model_1.default({ userId, items: [{ productId, quantity }] });
    }
    else {
        const existingItemIndex = wishlist.items.findIndex((item) => item.productId.toString() === productId);
        if (existingItemIndex > -1) {
            wishlist.items[existingItemIndex].quantity += quantity;
        }
        else {
            wishlist.items.push({ productId, quantity: Number(quantity) });
        }
    }
    await wishlist.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Wishlist updated successfully",
        statuscode: 200,
        data: wishlist,
    });
});
