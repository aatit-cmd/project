import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(error);
  let message = error?.message ?? "Internal server error";
  let status = error?.status ?? "error";
  let statusCode = error?.statusCode ?? 500;
  const success = false;

  if (error?.cause?.code === 11000) {
    statusCode = 400;
    status = "fail";
  }

  if(error instanceof JsonWebTokenError){
    statusCode = 401;
    message = "Invalid token. Login required";
  }

  if (error instanceof TokenExpiredError) {
    statusCode = 401;
    message = "Token expired. Login required";
  }
  
  res.status(statusCode).json({
    message,
    success,
    status,
    data: null,
    details: error?.errors ?? null,
    originalError: error?.stack,
  });
};
