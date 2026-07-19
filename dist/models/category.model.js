"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const image_model_1 = __importDefault(require("./image.model"));
//* Category Schema
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        trim: true,
        unique: true,
        minLength: 2,
        maxLength: 100,
    },
    description: {
        type: String,
        trim: true,
        minLength: 5,
        maxLength: 500,
    },
    logo: {
        type: image_model_1.default,
        required: [true, "Logo is required"],
        trim: true,
    },
}, {
    timestamps: true,
});
//* Category Model
const Category = mongoose_1.default.model("category", categorySchema);
exports.default = Category;
