import { Request, Response, NextFunction } from "express";
import Category from "../models/category.model";
import { catchAsync } from "../utils/catchAsync.utils";
import AppError from "../utils/appError.utils";
import { upload } from "../utils/cloudinary.utils";

const uploadFolder = "/category_logo";

//* get all -> sapana

export const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  },
);

//* get by id  -> rubina

export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      throw new AppError("category not found", 404);
    }

    res.status(200).json({
      message: `category by id ${id} is fetched`,
      success: true,
      status: "success",
      data: category,
    });
  },
);

//* create  -> ashmita
export const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;
    const file = req.file;

    if (!name) throw new AppError("name is required", 404);
    if (!description) throw new AppError("description is required", 404);

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new AppError("name already exists", 404);
    }

    const category = new Category({ name, description });

    if (file) {
      //* upload to cloudinary
      const { path, public_id } = await upload(file, uploadFolder);
      category.logo = {
        path,
        public_id,
      };
    }

    await category.save();

    res.status(201).json({
      message: "Category created successfully",
      status: "success",
      success: true,
      data: category,
    });
  },
);

//* update  -> atit

export const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const existingCategory = await Category.findById({ id });

    if (!existingCategory) {
      throw new AppError("Category does not exist", 404);
    }

    const { name, description } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: id },
      { name, description },
      { new: true },
    );

    res.status(201).json({
      success: true,
      message: "Category updated successfully.",
      data: updatedCategory,
    });
  },
);

//* delete  -> shristi
export const remove = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete({ _id: id });

    if (!category) {
      throw new AppError("category not found.", 404);
    }

    res.status(200).json({
      message: "category deleted successfully.",
      success: true,
      status: "success",
      data: null,
    });
  },
);
