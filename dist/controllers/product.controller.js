"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFeaturedProducts = exports.getAllNewArrivals = exports.getByBrand = exports.getByCategory = exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const product_model_1 = __importDefault(require("../models/product.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const brand_model_1 = __importDefault(require("../models/brand.model"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
// import { de } from "zod/locales";
const uploadFolder = "/product_cover";
//* get all
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { query, category, brand, minPrice, maxPrice } = req.query;
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
    //* category
    if (category) {
        filter.category = category;
    }
    //* brand
    if (brand) {
        filter.brand = brand;
    }
    //* price range
    if (minPrice || maxPrice) {
        const low = Number(minPrice);
        const high = Number(maxPrice);
        if (low) {
            filter.price = { $gte: low };
        }
        if (high) {
            filter.price = { $lte: high };
        }
        if (low && high) {
            filter.price = { $gte: low, $lte: high };
        }
    }
    const products = await product_model_1.default.find(filter);
    console.log(products);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "All product fetched",
        statuscode: 200,
        data: products,
    });
});
//* get by id
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const product = await product_model_1.default.findById(id);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "product fetched",
        statuscode: 200,
        data: product,
    });
});
//* create
exports.create = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { name, price, description, category, brand, new_arrival, is_featured, } = req.body;
    // const categoryExists = await Category.findById(category);
    // if (!categoryExists) {
    //   throw new appError("Invalid category selected", 400);
    // }
    // const brandExists = await Brand.findById(brand);
    // if (!brandExists) {
    //   throw new appError("Invalid category selected", 400);
    // }
    const product = new product_model_1.default({
        name,
        price,
        description,
        category,
        brand,
        new_arrival,
        is_featured,
    });
    // upload cover images
    const { cover_image, images } = req.files;
    if (!cover_image || !cover_image[0]) {
        throw new appError_utils_1.default("Cover image is required", 400);
    }
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(cover_image[0], uploadFolder);
    product.cover_image = { path, public_id };
    // upload images
    if (images && images.length > 0) {
        const promises = images.map((file) => (0, cloudinary_utils_1.upload)(file, uploadFolder));
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
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "product created",
        statuscode: 201,
        data: product,
    });
});
// deleted_images = [public_id]
// [5] = [3] + [2]
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const existingProduct = await product_model_1.default.findOne({ _id: id });
    if (!existingProduct)
        throw new appError_utils_1.default("Invalid product id", 404);
    const { price, description, category, brand, new_arrival, is_featured, deleted_images, } = req.body;
    if (price)
        existingProduct.price = price;
    if (description)
        existingProduct.description = description;
    if (category)
        existingProduct.category = category;
    if (brand)
        existingProduct.brand = brand;
    if (new_arrival)
        existingProduct.new_arrival = new_arrival;
    if (is_featured)
        existingProduct.is_featured = is_featured;
    const { cover_image, images } = req.files;
    //* update cover image
    if (cover_image && cover_image[0]) {
        (0, cloudinary_utils_1.deleteFile)(existingProduct.cover_image.public_id);
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(cover_image[0], uploadFolder);
        existingProduct.cover_image = { path, public_id };
    }
    //* update images
    if (deleted_images &&
        Array.isArray(deleted_images) &&
        deleted_images.length > 0) {
        // const promises = deleted_images.map(deleteFile);
        // const files = await Promise.allSettled(promises);
        Promise.allSettled(deleted_images.map((public_id) => (0, cloudinary_utils_1.deleteFile)(public_id)));
        existingProduct.images = existingProduct.images.filter((img) => !deleted_images.includes(img.public_id).toString());
    }
    //* if new images
    if (images && images.length > 0) {
        const files = await Promise.allSettled(images.map((file) => (0, cloudinary_utils_1.upload)(file, uploadFolder)));
        const newImages = files
            .filter((promise) => promise.status === "fulfilled")
            .map((img) => img.value);
        existingProduct.set("images", [...existingProduct.images, ...newImages]);
    }
});
//* delete
exports.remove = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const product = await product_model_1.default.findOne({ _id: id });
    if (!product) {
        throw new appError_utils_1.default("id not found to delete", 404);
    }
    //* delete cover image
    (0, cloudinary_utils_1.deleteFile)(product.cover_image.public_id);
    //* delete images
    if (product.images && product.images.length > 0) {
        Promise.allSettled(product.images.map((img) => (0, cloudinary_utils_1.deleteFile)(img.public_id)));
    }
    //* delete product
    await product_model_1.default.deleteOne({ _id: id });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `product: ${id}  deleted successfully`,
        statuscode: 200,
        data: null,
    });
});
//* get all by category
exports.getByCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { categoryId } = req.params;
    const categoryExists = await category_model_1.default.findById(categoryId);
    if (!categoryExists) {
        throw new appError_utils_1.default("Category not found", 404);
    }
    const products = await product_model_1.default.find({ category: categoryId }).populate([
        { path: "category", select: "name" },
        { path: "brand", select: "name" },
    ]);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Products fetched by category successfully",
        statuscode: 200,
        data: products,
    });
});
//* get all by brand
exports.getByBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { brandId } = req.params;
    const brandExists = await brand_model_1.default.findById(brandId);
    if (!brandExists) {
        throw new appError_utils_1.default("Brand not found", 404);
    }
    const products = await product_model_1.default.find({ brand: brandId }).populate([
        { path: "category", select: "name" },
        { path: "brand", select: "name" },
    ]);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Products fetched by brand successfully",
        statuscode: 200,
        data: products,
    });
});
//* get all new arrivals
exports.getAllNewArrivals = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const products = await product_model_1.default.find({ new_arrival: true }).populate([
        { path: "category", select: "name" },
        { path: "brand", select: "name" },
    ]);
    if (!products || products.length === 0) {
        throw new appError_utils_1.default("No new arrival products found", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "new arrivals fetched successfully",
        statuscode: 200,
        data: products,
    });
});
//* get all featured products
exports.getAllFeaturedProducts = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const products = await product_model_1.default.find({ is_featured: true }).populate([
        { path: "category", select: "name" },
        { path: "brand", select: "name" },
    ]);
    if (!products || products.length === 0) {
        throw new appError_utils_1.default("featured products not found", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "new arrivals fetched successfully",
        statuscode: 200,
        data: products,
    });
});
