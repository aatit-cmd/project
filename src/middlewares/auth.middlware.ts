import { Role } from "../types/enum.types";
import { Request, Response, NextFunction } from "express";

//* 1. login
//* 2. authorized ?

export const authenticate = (roles?: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. get access_token
        // 2. verify access_token
        // 3. check token expired or not
        // 4. check role

    } catch (error) {
      next(error);
    }
  };
};
