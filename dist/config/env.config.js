"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV_CONFIG = void 0;
require("dotenv/config");
exports.ENV_CONFIG = {
    //* environment
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    APP_NAME: process.env.APP_NAME,
    FRONT_END_URL: process.env.FRONT_END_URL,
    //* Database
    DB_URI: process.env.DB_URI,
    //* cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    //* jwt
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    //* nodemailer
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_SERVICE: process.env.SMTP_SERVICE,
    SMTP_PORT: Number(process.env.SMTP_PORT ?? "587"),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
};
exports.default = exports.ENV_CONFIG;
