import { Role } from "../types/enum.types";
import { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import appError from "../utils/appError.utils";
import { verifyJwtToken } from "../utils/jwt.utils";
import { ENV_CONFIG } from "../config/env.config";

//* 1. login
//* 2. authorized ?

export const authenticate = (roles?: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. get access_token
      const cookies = req.cookies;
      const access_token = cookies["access_token"];
      console.log(access_token);

      if (!access_token) {
        throw new appError("Unauthorized. login required", 401);
      }

      // 2. verify access_token
      const decoded_data = verifyJwtToken(access_token);
      if (!decoded_data) {
        throw new appError("invalid token. login required", 401);
      }
      console.log(decoded_data);

      // 3. check token expired or not
      if (decoded_data.exp * 1000 < Date.now()) {
        // clear cookie
        res.clearCookie("access_token", {
          httpOnly: ENV_CONFIG.NODE_ENV === "development" ? false : true,
          secure: ENV_CONFIG.NODE_ENV === "development" ? false : true,
          maxAge: Date.now(), 
          sameSite: ENV_CONFIG.NODE_ENV === "development" ? "lax" : "none",
        });
        throw new appError("token expired. Access denied", 401);
      }
      // 4. check role

      if(roles && roles.length > 0 && !roles.includes(decoded_data.role)){
        throw new appError("Unauthorized .Access denied", 403);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
