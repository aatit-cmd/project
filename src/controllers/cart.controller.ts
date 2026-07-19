import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import Cart from "../models/cart.model";
// export const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

// })

export const addToCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const { productId, quantity = 1 } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const newCart = new Cart({ userId, items: [{ productId, quantity }] });

      await newCart.save();

    } else {
      const existingItemIndex = await cart.items.findIndex(
        (items) => items.productId.toString() === productId,
      );

      if(existingItemIndex > -1){
        // cart.
      }

    }
  },
);
