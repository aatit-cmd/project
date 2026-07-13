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

const uploadFolder = "/profile_images";

//* register

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { full_name, email, password, phone } = req.body;

    const file = req.file;

    if (!full_name) {
      // const error :any = new Error("full_name is required");
      // error.statusCode = 400;
      // error.status = "fail";
      // throw error;

      throw new appError("full_name is required", 400);
    }
    if (!email) {
      // const error :any = new Error("email is required");
      // error.statusCode = 400;
      // error.status = "fail";
      // throw error;

      throw new appError("email is required", 400);
    }
    if (!password) {
      // const error :any = new Error("password is required");
      // error.statusCode = 400;
      // error.status = "fail";
      // throw error;

      throw new appError("password is required", 400);
    }

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
      html: `<div>
      <h2>Account created</h2>
      <p>Hi ${user.full_name}, welcome to our service</p>
    </div>`,
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
    sendResponse(res, {
      message: "Login sucess",
      statuscode: 201,
      data: { user: rest, access_token },
    });
  },
);

// get all
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

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

//* logout

//* get profile

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

    //* send success response
    sendResponse(res, {
      message: "Profile image updated",
      statuscode: 200,
      data: user,
    });
  },
);
//* change password

//* forgot password

//* change email
