import { Request, Response, NextFunction } from "express";

import Brand from "../models/brand.model";
import appError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { upload } from "../utils/cloudinary.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { getPagenation } from "../utils/pagenation.utils";

const uploadFolder = "/brand_logo";
// getAll
export const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      query,
      order = "DESC",
      sortBy = "createdAt",
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    const filter: Record<string, any> = {};
    if (query) {
      filter.$or = [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          description: {
            $regex: query,
            $options: "i",
          },
        },
      ];
    }

    const brands = await Brand.find(filter)
      .limit(perPage)
      .skip(skip)
      .sort({
        [sortBy as string]: order === "DESC" ? -1 : 1,
      });

    const totalCount = await Brand.countDocuments(filter);
    // 21, limit 10 -> 2.1 ->3

    sendResponse(res, {
      message: "Brands fetched",
      data: {
        brands,
        pagination: {
          brands,
          pagination: getPagenation(totalCount, perPage, currentPage),
        },
      },
      statuscode: 200,
    });
  },
);

// getByBrand
export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { brand } = req.params;

    const existingBrand = await Brand.findById({ brand: brand });

    if (!existingBrand) {
      return new appError("Brand  not found", 404);
    }

    // res.status(200).json({
    //   message: "brand fetched",
    //   status: "success",
    //   success: true,
    //   data: brand,
    // });

    sendResponse(res, {
      message: "brand fetched",
      data: brand,
      statuscode: 200,
    });
  },
);

export const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    const file = req.file;

    if (!name) {
      throw new appError("Brand_name is required", 400);
    }
    if (!description) {
      throw new appError("Description is required", 400);
    }

    const brand = new Brand({
      name,
      description,
    });

    if (file) {
      //* upload to cloudinary
      const { path, public_id } = await upload(file, uploadFolder);
      brand.logo = {
        path,
        public_id,
      };
    }

    await brand.save();

    res.status(201).json({
      message: "brand created",
      status: "success",
      success: true,
      data: brand,
    });
  },
);

export const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const { name, description } = req.body;

    if (!name) {
      throw new appError("Brand_name is required", 400);
    }
    if (!description) {
      throw new appError("Description is required", 400);
    }

    const updateBrand = await Brand.findByIdAndUpdate(
      { _id: id },
      { name, description },
      { new: true },
    );

    if (!updateBrand) {
      throw new appError("Id not found to update", 404);
    }

    res.status(201).json({
      message: "brand updated",
      status: "success",
      success: true,
      data: updateBrand,
    });
  },
);

export const remove = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedBrand = await Brand.findByIdAndDelete({ _id: id });

    if (!deletedBrand) {
      throw new appError("id not found to delete", 404);
    }

    res.status(200).json({
      message: "brand deleted",
      status: "success",
      success: true,
      data: deletedBrand,
    });
  },
);
