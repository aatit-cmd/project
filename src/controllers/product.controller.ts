import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import Product from "../models/product.model";
import Category from "../models/category.model";
import appError from "../utils/appError.utils";
import Brand from "../models/brand.model";
import { upload } from "../utils/cloudinary.utils";

const uploadFolder = "/product_cover";

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
export const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      price,
      description,
      category,
      brand,
      new_arrival,
      is_featured,
    } = req.body;
    const file = req.file;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new appError("Invalid category selected", 400);
    }

    const brandExists = await Brand.findById(brand);
    if (!brandExists) {
      throw new appError("Invalid category selected", 400);
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      brand,
      new_arrival,
      is_featured,
    });

    if (file) {
      //* upload to cloudinary
      const { path, public_id } = await upload(file, uploadFolder);
      product.cover_image = {
        path,
        public_id,
      };
    }

    await product.save();
    const populatedProduct = await product.populate([
      { path: "category", select: "name" },
      { path: "brand", select: "name" },
    ]);

    sendResponse(res, {
      message: "product created",
      statuscode: 201,
      data: populatedProduct.toObject(),
    });
  },
);

//* update
export const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;
    if (!name) {
      throw new appError("Invalid product name", 400);
    }

  },
);
//* delete

//* get all by category

//* get all by brand

//* get all new arrivals

//* get all featured products
