"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCart = exports.viewCart = void 0;
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const cart_model_1 = __importDefault(require("../models/cart.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const product_model_1 = __importDefault(require("../models/product.model"));
// export const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
// })
exports.viewCart = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user?._id;
    const cart = await cart_model_1.default.findOne({ userId });
    if (!cart) {
        throw new appError_utils_1.default("cart not found", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "cart is fetched successfully",
        statuscode: 200,
        data: cart,
    });
});
exports.addToCart = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user?._id;
    const { productId, quantity = 1 } = req.body;
    const product = await product_model_1.default.findById(productId);
    if (!product) {
        throw new appError_utils_1.default("product is not found", 404);
    }
    const itemQuantity = Number(quantity);
    let cart = await cart_model_1.default.findOne({ userId });
    if (!cart) {
        cart = new cart_model_1.default({
            userId,
            items: [
                { productId, quantity, subTotal: product.price * itemQuantity },
            ],
        });
    }
    else {
        const existingItemIndex = cart.items.findIndex((items) => items.productId.toString() === productId);
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += itemQuantity;
            cart.items[existingItemIndex].subTotal =
                product.price * cart.items[existingItemIndex].quantity;
        }
        else {
            cart.items.push({
                productId,
                quantity: itemQuantity,
                subTotal: product.price * itemQuantity,
            });
        }
    }
    cart.totalPrice = cart.items.reduce((acc, items) => acc + items.subTotal, 0);
    await cart.save();
    await cart.populate({
        path: "items.productId",
        select: "name price cover_image",
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Item added to cart successfully",
        statuscode: 200,
        data: cart,
    });
});
