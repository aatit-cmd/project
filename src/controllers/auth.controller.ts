import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils";
import appError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { deleteFile, upload } from "../utils/cloudinary.utils";
import { IJwtPayload } from "../types/gloabal.types";
import { generateJwtToken } from "../utils/jwt.utils";
import ENV_CONFIG from "../config/env.config";
import { sendResponse } from "../utils/sendResponse.utils";
import { sendEmail } from "../utils/emailServer.utils";
import {
  accountCreatedHtml,
  newLoginDetectedHtml,
} from "../utils/emailTemplate.utils";

const uploadFolder = "/profile_images";

//* register

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

    const user = new User({ email, password, full_name, phone });

    // hash password
    const hashPass = await hashPassword(password);
    user.password = hashPass;

    // handle profile image upload
    if (file) {
      //* upload to cloudinary
      const { path, public_id } = await upload(file, uploadFolder);
      user.profile_image = {
        path,
        public_id,
      };
    }

    //! save user
    await user.save();

    //* send account created email
    sendEmail({
      to: user.email,
      subject: "Account created",
      html: accountCreatedHtml({
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
  },
);

//* login
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // email, password
    const { email, password } = req.body;
    if (!email) {
      throw new appError("email is required", 400);
    }
    if (!password) {
      throw new appError("password is required", 400);
    }

    // find user by email
    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      throw new appError("credentials not matched", 400);
    }

    // compare password
    const isPassMatched = await comparePassword(password, user.password);

    if (!isPassMatched) {
      throw new appError("credentials not matched", 400);
    }

    //todo: generate jwt token
    const payload: IJwtPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const access_token = generateJwtToken(payload);

    res.cookie("access_token", access_token, {
      httpOnly: ENV_CONFIG.NODE_ENV === "development" ? false : true,
      secure: ENV_CONFIG.NODE_ENV === "development" ? false : true,
      maxAge: 1000 * 60 * 60 * 24 * 7, //* 7 days
      sameSite: ENV_CONFIG.NODE_ENV === "development" ? "lax" : "none",
    });

    //* send success response
    // res.status(200).json({
    //   message: "Login sucess",
    //   status: "success",
    //   success: true,
    //   data: { user, access_token },
    // });

    const { password: user_pass, ...rest } = user.toObject(); // remove password from response

    sendEmail({
      to: user.email,
      subject: "New Login Detected",
      html: newLoginDetectedHtml({
        full_name: user.full_name,
        loginTime: new Date(Date.now()),
        email: user.email,
        device: req.headers["user-agent"]!!,
      }),
    });

    sendResponse(res, {
      message: "Login sucess",
      statuscode: 201,
      data: { user: rest, access_token },
    });
  },
);

// logout
export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("access_token", {
      httpOnly: ENV_CONFIG.NODE_ENV === "development" ? false : true,
      secure: ENV_CONFIG.NODE_ENV === "development" ? false : true,
      maxAge: Date.now(),
      sameSite: ENV_CONFIG.NODE_ENV === "development" ? "lax" : "none",
    });
    sendResponse(res, {
      message: `${req.user.email} logged out successsfully`,
      statuscode: 200,
      data: req.user,
    });
  },
);

// get all
export const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    // res.status(200).json({
    //   message: "All users fetched",
    //   status: "success",
    //   success: true,
    //   data: users,
    // });

    sendResponse(res, {
      message: "All users fetched",
      statuscode: 200,
      data: users,
    });
  },
);

// get byid
export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById({ _id: id });

    if (!user) {
      throw new appError("user by id not matched", 404);
    }
    // res.status(200).json({
    //   message: "user fetched",
    //   status: "success",
    //   success: true,
    //   data: user,
    sendResponse(res, {
      message: "user fetched",
      statuscode: 200,
      data: user,
    });
  },
);

//* get profile
export const getProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.user._id;
    const user = await User.findById(user_id).select("-password");

    if (!user) {
      sendResponse(res, {
        message: "user not found",
        statuscode: 404,
        data: null,
      });
      return;
    }

    sendResponse(res, {
      message: "user  found",
      statuscode: 200,
      data: user,
    });
  },
);

//* change profile image
export const changeProfileImage = catchAsync(
  async (req: Request, res: Response) => {
    const { _id } = req.user;
    const file = req.file;
    if (!file) {
      throw new appError("profile_image is required", 400);
    }
    const user = await User.findOne({ _id: _id });
    if (!user) {
      throw new appError("Profile not found", 404);
    }

    //! delete old image
    if (user.profile_image && user.profile_image?.public_id) {
      await deleteFile(user.profile_image.public_id);
    }

    const { path, public_id } = await upload(file, uploadFolder);
    user.profile_image = {
      path,
      public_id,
    };
    //  Database ma save garna ekdam jaroori chha!
    await user.save();
    //* send success response
    sendResponse(res, {
      message: "Profile image updated",
      statuscode: 200,
      data: user.toObject(),
    });
  },
);
//* change password

//* forgot password

//* change email
