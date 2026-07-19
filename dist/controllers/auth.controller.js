"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeProfileImage = exports.getProfile = exports.getById = exports.getAll = exports.logout = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const emailServer_utils_1 = require("../utils/emailServer.utils");
const emailTemplate_utils_1 = require("../utils/emailTemplate.utils");
const uploadFolder = "/profile_images";
//* register
exports.register = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { full_name, email, password, phone } = req.body;
    const file = req.file;
    // if (!full_name) {
    //   // const error :any = new Error("full_name is required");
    //   // error.statusCode = 400;
    //   // error.status = "fail";
    //   // throw error;
    //   throw new appError("full_name is required", 400);
    // }
    // if (!email) {
    //   // const error :any = new Error("email is required");
    //   // error.statusCode = 400;
    //   // error.status = "fail";
    //   // throw error;
    //   throw new appError("email is required", 400);
    // }
    // if (!password) {
    //   // const error :any = new Error("password is required");
    //   // error.statusCode = 400;
    //   // error.status = "fail";
    //   // throw error;
    //   throw new appError("password is required", 400);
    // }
    const user = new user_model_1.default({ email, password, full_name, phone });
    // hash password
    const hashPass = await (0, bcrypt_utils_1.hashPassword)(password);
    user.password = hashPass;
    // handle profile image upload
    if (file) {
        //* upload to cloudinary
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
        user.profile_image = {
            path,
            public_id,
        };
    }
    //! save user
    await user.save();
    //* send account created email
    (0, emailServer_utils_1.sendEmail)({
        to: user.email,
        subject: "Account created",
        html: (0, emailTemplate_utils_1.accountCreatedHtml)({
            full_name: user.full_name,
            createdAt: user.createdAt,
            email: user.email,
        }),
    });
    //* success response
    res.status(201).json({
        message: "Account created",
        success: true,
        status: "success",
        data: user,
    });
});
//* login
exports.login = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    // email, password
    const { email, password } = req.body;
    if (!email) {
        throw new appError_utils_1.default("email is required", 400);
    }
    if (!password) {
        throw new appError_utils_1.default("password is required", 400);
    }
    // find user by email
    const user = await user_model_1.default.findOne({ email: email }).select("+password");
    if (!user) {
        throw new appError_utils_1.default("credentials not matched", 400);
    }
    // compare password
    const isPassMatched = await (0, bcrypt_utils_1.comparePassword)(password, user.password);
    if (!isPassMatched) {
        throw new appError_utils_1.default("credentials not matched", 400);
    }
    //todo: generate jwt token
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
    };
    const access_token = (0, jwt_utils_1.generateJwtToken)(payload);
    res.cookie("access_token", access_token, {
        httpOnly: env_config_1.default.NODE_ENV === "development" ? false : true,
        secure: env_config_1.default.NODE_ENV === "development" ? false : true,
        maxAge: 1000 * 60 * 60 * 24 * 7, //* 7 days
        sameSite: env_config_1.default.NODE_ENV === "development" ? "lax" : "none",
    });
    //* send success response
    // res.status(200).json({
    //   message: "Login sucess",
    //   status: "success",
    //   success: true,
    //   data: { user, access_token },
    // });
    const { password: user_pass, ...rest } = user.toObject(); // remove password from response
    (0, emailServer_utils_1.sendEmail)({
        to: user.email,
        subject: "New Login Detected",
        html: (0, emailTemplate_utils_1.newLoginDetectedHtml)({
            full_name: user.full_name,
            loginTime: new Date(Date.now()),
            email: user.email,
            device: req.headers["user-agent"],
        }),
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Login sucess",
        statuscode: 201,
        data: { user: rest, access_token },
    });
});
// logout
exports.logout = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    res.clearCookie("access_token", {
        httpOnly: env_config_1.default.NODE_ENV === "development" ? false : true,
        secure: env_config_1.default.NODE_ENV === "development" ? false : true,
        maxAge: Date.now(),
        sameSite: env_config_1.default.NODE_ENV === "development" ? "lax" : "none",
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `${req.user.email} logged out successsfully`,
        statuscode: 200,
        data: req.user,
    });
});
// get all
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const users = await user_model_1.default.find();
    // res.status(200).json({
    //   message: "All users fetched",
    //   status: "success",
    //   success: true,
    //   data: users,
    // });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "All users fetched",
        statuscode: 200,
        data: users,
    });
});
// get byid
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const user = await user_model_1.default.findById({ _id: id });
    if (!user) {
        throw new appError_utils_1.default("user by id not matched", 404);
    }
    // res.status(200).json({
    //   message: "user fetched",
    //   status: "success",
    //   success: true,
    //   data: user,
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "user fetched",
        statuscode: 200,
        data: user,
    });
});
//* get profile
exports.getProfile = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const user_id = req.user._id;
    const user = await user_model_1.default.findById(user_id).select("-password");
    if (!user) {
        (0, sendResponse_utils_1.sendResponse)(res, {
            message: "user not found",
            statuscode: 404,
            data: null,
        });
        return;
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "user  found",
        statuscode: 200,
        data: user,
    });
});
//* change profile image
exports.changeProfileImage = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { _id } = req.user;
    const file = req.file;
    if (!file) {
        throw new appError_utils_1.default("profile_image is required", 400);
    }
    const user = await user_model_1.default.findOne({ _id: _id });
    if (!user) {
        throw new appError_utils_1.default("Profile not found", 404);
    }
    //! delete old image
    if (user.profile_image && user.profile_image?.public_id) {
        await (0, cloudinary_utils_1.deleteFile)(user.profile_image.public_id);
    }
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
    user.profile_image = {
        path,
        public_id,
    };
    //  Database ma save garna ekdam jaroori chha!
    await user.save();
    //* send success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Profile image updated",
        statuscode: 200,
        data: user.toObject(),
    });
});
//* change password
//* forgot password
//* change email
