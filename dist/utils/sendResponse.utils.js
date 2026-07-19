"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, resData) => {
    const { message, statuscode, data } = resData;
    res.status(statuscode).json({
        message,
        data,
        success: String(statuscode).startsWith("2"),
        status: String(statuscode).startsWith("2")
            ? "success"
            : String(statuscode).startsWith("4")
                ? "fail"
                : "error",
    });
};
exports.sendResponse = sendResponse;
