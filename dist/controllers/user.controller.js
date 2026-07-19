"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getById = exports.getAllAdmins = exports.getAll = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const enum_types_1 = require("../types/enum.types");
// get all
const getAll = async (req, res, next) => {
    try {
        const users = await user_model_1.default.find({ role: enum_types_1.Role.USER });
        res.status(200).json({
            message: "All users fetched",
            status: "success",
            success: true,
            data: users
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
// get all admins
const getAllAdmins = async (req, res, next) => {
    try {
        const admins = await user_model_1.default.find({ role: {
                $in: [enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN]
            } });
        res.status(200).json({
            message: "All users fetched",
            status: "success",
            success: true,
            data: admins
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllAdmins = getAllAdmins;
// get byid
const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await user_model_1.default.findById({ _id: id });
        if (!user) {
            throw new appError_utils_1.default("user by id not matched", 404);
        }
        res.status(200).json({
            message: "user fetched",
            status: "success",
            success: true,
            data: user
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
