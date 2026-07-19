"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const errorHandler = (error, req, res, next) => {
    console.log(error);
    let message = error?.message ?? "Internal server error";
    let status = error?.status ?? "error";
    let statusCode = error?.statusCode ?? 500;
    const success = false;
    if (error?.cause?.code === 11000) {
        statusCode = 400;
        status = "fail";
    }
    if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
        statusCode = 401;
        message = "Invalid token. Login required";
    }
    if (error instanceof jsonwebtoken_1.TokenExpiredError) {
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
exports.errorHandler = errorHandler;
