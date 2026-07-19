"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const image_model_1 = __importDefault(require("./image.model"));
//* product schema
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: [3, "Product name must be at least 3 characters"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Product price must be at least 0"],
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        trim: true,
        minlength: [5, "Product description must be at least 30 characters"],
        maxlength: [1000, "Product description must be at most 1000 characters"],
    },
    cover_image: {
        type: image_model_1.default,
        required: [true, "Product cover image is required"],
    },
    // category : 1231423525 => {}
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "category",
        required: [true, "Product category is required"],
    },
    brand: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "brand",
        required: [true, "Product brand is required"],
    },
    images: [
        {
            type: image_model_1.default,
            default: null,
        },
    ],
    new_arrival: {
        type: Boolean,
        default: false,
    },
    is_featured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
//* product model
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
