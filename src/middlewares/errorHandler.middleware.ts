import { NextFunction, Request, Response } from "express";

export const errorHandler = (error:any, req : Request, res: Response, next : NextFunction)=>{
    console.log(error);
    const message = error?.message ??"Internal server error";
    const status = error?.status ?? "error";
    const statusCode = error?.statusCode ?? 500;
    const success = false;

    res.status(statusCode).json({
        message,
        success,
        status,
        data: null,
        originalError: error?.stack,
    });
}