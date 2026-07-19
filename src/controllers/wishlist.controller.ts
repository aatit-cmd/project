import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import Wishlist from "../models/wishlist.model";
import { sendResponse } from "../utils/sendResponse.utils";
import appError from "../utils/appError.utils";

export const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const wishlist = await Wishlist.find().populate({
      path: "items.productId",
      select: "name price cover_image brand description",
    });

    sendResponse(res, {
      message: "wishlist is fetched",
      statuscode: 200,
      data: wishlist,
    });
  },
);

export const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      throw new appError("Product ID is required", 400);
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [{productId, quantity}] });
    } else {
      const existingItemIndex = wishlist.items.findIndex(
        (item) => item.productId.toString() === productId,
      );
      if (existingItemIndex > -1) {
        wishlist.items[existingItemIndex].quantity += quantity;
      } else {
        wishlist.items.push({ productId, quantity: Number(quantity) });
      }
    }
    await wishlist.save();

    sendResponse(res, {
      message: "Wishlist updated successfully",
      statuscode: 200,
      data: wishlist,
    });
  },
);

