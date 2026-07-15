import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import Product from "../models/product.model";
import Category from "../models/category.model";
import appError from "../utils/appError.utils";
import Brand from "../models/brand.model";
import { deleteFile, upload } from "../utils/cloudinary.utils";

const uploadFolder = "/product_cover";

//* get all
export const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find();
    sendResponse(res, {
      message: "All product fetched",
      statuscode: 200,
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

    // const categoryExists = await Category.findById(category);
    // if (!categoryExists) {
    //   throw new appError("Invalid category selected", 400);
    // }

    // const brandExists = await Brand.findById(brand);
    // if (!brandExists) {
    //   throw new appError("Invalid category selected", 400);
    // }

    const product = new Product({
      name,
      price,
      description,
      category,
      brand,
      new_arrival,
      is_featured,
    });

    // upload cover images
    const { cover_image, images } = req.files as {
      cover_image: Express.Multer.File[];
      images: Express.Multer.File[];
    };

    if (!cover_image || !cover_image[0]) {
      throw new appError("Cover image is required", 400);
    }
    const { path, public_id } = await upload(cover_image[0], uploadFolder);

    product.cover_image = { path, public_id };

    // upload images
    if (images && images.length > 0) {
      const promises = images.map((file) => upload(file, uploadFolder));

      const files = await Promise.allSettled(promises);

      const fullfilled = files
        .filter((promise) => promise.status === "fulfilled")
        .map((img) => img.value);

      product.set("images", fullfilled);
    }

    // save product
    await product.save();
    // const populatedProduct = await product.populate([
    //   { path: "category", select: "name" },
    //   { path: "brand", select: "name" },
    // ]);
    //send response
    sendResponse(res, {
      message: "product created",
      statuscode: 201,
      data: product.toObject(),
    });
  },
);

//* update
export const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      throw new appError("Invalid product id", 404);
    }
    const { price, description, category, brand, new_arrival, is_featured } =
      req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const newcoverImageFile = files?.["cover_image"]?.[0];

    if (newcoverImageFile) {
      if (existingProduct?.cover_image?.public_id) {
        await deleteFile(existingProduct.cover_image?.public_id);
      }
      const { path, public_id } = await upload(newcoverImageFile, uploadFolder);
      existingProduct.cover_image = { path, public_id };
    }

    const galleryImageFiles = files?.["images"] || [];

    if (galleryImageFiles.length > 0) {
      if (existingProduct.images && existingProduct.images.length > 0) {
        for (const img of existingProduct.images) {
          await deleteFile(img.public_id);
        }
        existingProduct.images = [] as any;
      }

      const uploadPromises = galleryImageFiles.map(async (imgFile) => {
        const { path, public_id } = await upload(imgFile, uploadFolder);
        return { path, public_id };
      });

      const uploadedImages = await Promise.all(uploadPromises);

      existingProduct.images.push(...uploadedImages);
    }
    if (price !== undefined) existingProduct.price = price;
    if (description !== undefined) existingProduct.description = description;
    if (category !== undefined) existingProduct.category = category;
    if (brand !== undefined) existingProduct.brand = brand;
    if (new_arrival !== undefined) existingProduct.new_arrival = new_arrival;
    if (is_featured !== undefined) existingProduct.is_featured = is_featured;

    await existingProduct.save();

    const populatedProduct = await existingProduct.populate([
      { path: "category", select: "name" },
      { path: "brand", select: "name" },
    ]);

    sendResponse(res, {
      message: "product updated successfully",
      statuscode: 201,
      data: populatedProduct.toObject(),
    });
  },
);

//* delete
export const remove = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(id);

    if (!deleteProduct) {
      throw new appError("id not found to delete", 404);
    }

    sendResponse(res, {
      message: "product deleted successfully",
      statuscode: 200,
      data: null,
    });
  },
);

//* get all by category
export const getByCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      throw new appError("Category not found", 404);
    }

    const products = await Product.find({ category: categoryId }).populate([
      { path: "category", select: "name" },
      { path: "brand", select: "name" },
    ]);

    sendResponse(res, {
      message: "Products fetched by category successfully",
      statuscode: 200,
      data: products,
    });
  },
);

//* get all by brand
export const getByBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { brandId } = req.params;
    const brandExists = await Brand.findById(brandId);
    if (!brandExists) {
      throw new appError("Brand not found", 404);
    }

    const products = await Product.find({ brand: brandId }).populate([
      { path: "category", select: "name" },
      { path: "brand", select: "name" },
    ]);

    sendResponse(res, {
      message: "Products fetched by brand successfully",
      statuscode: 200,
      data: products,
    });
  },
);

//* get all new arrivals
export const getAllNewArrivals = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({ new_arrival: true }).populate([
      { path: "category", select: "name" },
      { path: "brand", select: "name" },
    ]);
    if (!products || products.length === 0) {
      throw new appError("No new arrival products found", 404);
    }

    sendResponse(res, {
      message: "new arrivals fetched successfully",
      statuscode: 200,
      data: products,
    });
  },
);

//* get all featured products
export const getAllFeaturedProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({ is_featured: true }).populate([
      { path: "category", select: "name" },
      { path: "brand", select: "name" },
    ]);
    if (!products || products.length === 0) {
      throw new appError("featured products not found", 404);
    }

    sendResponse(res, {
      message: "new arrivals fetched successfully",
      statuscode: 200,
      data: products,
    });
  },
);
