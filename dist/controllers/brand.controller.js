"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const brand_model_1 = __importDefault(require("../models/brand.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const pagenation_utils_1 = require("../utils/pagenation.utils");
const uploadFolder = "/brand_logo";
// getAll
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { query, order = "DESC", sortBy = "createdAt", page = 1, limit = 10, } = req.query;
    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;
    const filter = {};
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
    const brands = await brand_model_1.default.find(filter)
        .limit(perPage)
        .skip(skip)
        .sort({
        [sortBy]: order === "DESC" ? -1 : 1,
    });
    const totalCount = await brand_model_1.default.countDocuments(filter);
    // 21, limit 10 -> 2.1 ->3
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Brands fetched",
        data: {
            brands,
            pagination: {
                brands,
                pagination: (0, pagenation_utils_1.getPagenation)(totalCount, perPage, currentPage),
            },
        },
        statuscode: 200,
    });
});
// getByBrand
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { brand } = req.params;
    const existingBrand = await brand_model_1.default.findById({ brand: brand });
    if (!existingBrand) {
        return new appError_utils_1.default("Brand  not found", 404);
    }
    // res.status(200).json({
    //   message: "brand fetched",
    //   status: "success",
    //   success: true,
    //   data: brand,
    // });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "brand fetched",
        data: brand,
        statuscode: 200,
    });
});
exports.create = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { name, description } = req.body;
    const file = req.file;
    if (!name) {
        throw new appError_utils_1.default("Brand_name is required", 400);
    }
    if (!description) {
        throw new appError_utils_1.default("Description is required", 400);
    }
    const brand = new brand_model_1.default({
        name,
        description,
    });
    if (file) {
        //* upload to cloudinary
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
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
});
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name) {
        throw new appError_utils_1.default("Brand_name is required", 400);
    }
    if (!description) {
        throw new appError_utils_1.default("Description is required", 400);
    }
    const updateBrand = await brand_model_1.default.findByIdAndUpdate({ _id: id }, { name, description }, { new: true });
    if (!updateBrand) {
        throw new appError_utils_1.default("Id not found to update", 404);
    }
    res.status(201).json({
        message: "brand updated",
        status: "success",
        success: true,
        data: updateBrand,
    });
});
exports.remove = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const deletedBrand = await brand_model_1.default.findByIdAndDelete({ _id: id });
    if (!deletedBrand) {
        throw new appError_utils_1.default("id not found to delete", 404);
    }
    res.status(200).json({
        message: "brand deleted",
        status: "success",
        success: true,
        data: deletedBrand,
    });
});
