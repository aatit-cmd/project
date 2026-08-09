import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import Cart from "../models/cart.model";
import appError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import Product from "../models/product.model";
// export const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

// })
export const viewCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new appError("cart not found", 404);
    }

    sendResponse(res, {
      message: "cart is fetched successfully",
      statuscode: 200,
      data: cart,
    });
  },
);

export const addToCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      throw new appError("product is not found", 404);
    }

    const itemQuantity = Number(quantity);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          { productId, quantity, subTotal: product.price * itemQuantity },
        ],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (items) => items.productId.toString() === productId,
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += itemQuantity;

        cart.items[existingItemIndex].subTotal =
          product.price * cart.items[existingItemIndex].quantity;
      } else {
        cart.items.push({
          productId,
          quantity: itemQuantity,
          subTotal: product.price * itemQuantity,
        });
      }
    }
    cart.totalPrice = cart.items.reduce(
      (acc, items) => acc + items.subTotal,
      0,
    );
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "name price cover_image",
    });

    sendResponse(res, {
      message: "Item added to cart successfully",
      statuscode: 200,
      data: cart,
    });
  },
);
