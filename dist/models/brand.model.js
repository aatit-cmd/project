"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const image_model_1 = __importDefault(require("./image.model"));
// brand schema (name ,description, logo)
const brandSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "brand_name is required"],
        minLength: [3, "name must be at least 3 character long"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "description is required"],
        minLength: [3, "name must be at least 3 character long"],
        trim: true,
    },
    logo: {
        type: image_model_1.default,
        required: [true, "logo is required"],
    }
});
// brand model
const Brand = mongoose_1.default.model("brand", brandSchema);
exports.default = Brand;
