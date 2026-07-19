"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_types_1 = require("../types/enum.types");
const image_model_1 = __importDefault(require("./image.model"));
// user schema
const userSchema = new mongoose_1.default.Schema({
    full_name: {
        type: String,
        required: [true, "full_name is required"],
        minLength: [3, "name must be at least 3 character long"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, " user already exists with provided email"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        select: false,
    },
    profile_image: {
        type: image_model_1.default,
        default: null,
    },
    role: {
        type: String,
        enum: Object.values(enum_types_1.Role),
        default: enum_types_1.Role.USER,
    },
    phone: {
        type: String,
        required: false,
        maxLength: [10, "phone number at most be 10 digit long"],
    },
}, { timestamps: true });
//* user model
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
