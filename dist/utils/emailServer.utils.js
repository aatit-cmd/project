"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_config_1 = __importDefault(require("../config/nodemailer.config"));
const env_config_1 = __importDefault(require("../config/env.config"));
const sendEmail = async ({ to, subject, html, cc, bcc, attachments, }) => {
    try {
        // const { to, subject, html, cc, bcc, attachments } = mailOptions;
        const mailOptions = {
            from: env_config_1.default.SMTP_FROM_EMAIL,
            to: to,
            subject: subject,
            html: html,
        };
        if (cc) {
            mailOptions["cc"] = cc;
        }
        if (bcc) {
            mailOptions["bcc"] = bcc;
        }
        if (attachments) {
            mailOptions["attachments"] = attachments;
        }
        await nodemailer_config_1.default.sendMail(mailOptions);
        console.log("mail sent");
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendEmail = sendEmail;
