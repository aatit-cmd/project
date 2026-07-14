import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import Product from "../models/product.model";

//* get all
export const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find();
    sendResponse(res, {
      message: "All product fetched",
      statuscode: 400,
      data: products,
    });
  },
);
//* get by id
export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    sendResponse(res, {
      message: "product fetched",
      statuscode: 200,
      data: product,
    });
  },
);

//* create

//* update

//* delete

//* get all by category

//* get all by brand

//* get all new arrivals

//* get all featured products
