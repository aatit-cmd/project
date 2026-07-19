"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCart = void 0;
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const cart_model_1 = __importDefault(require("../models/cart.model"));
// export const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
// })
exports.addToCart = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user?._id;
    const { productId, quantity = 1 } = req.body;
    const cart = await cart_model_1.default.findOne({ userId });
    if (!cart) {
        const newCart = new cart_model_1.default({ userId, items: [{ productId, quantity }] });
        await newCart.save();
    }
    else {
        const existingItemIndex = await cart.items.findIndex((items) => items.productId.toString() === productId);
        if (existingItemIndex > -1) {
            // cart.
        }
    }
});
