import nodemailer from "nodemailer";
import ENV_CONFIG from "./env.config";

const transporter = nodemailer.createTransport({
  host: ENV_CONFIG.SMTP_HOST,
  service: ENV_CONFIG.SMTP_SERVICE,
  port: ENV_CONFIG.SMTP_PORT,
  secure: ENV_CONFIG.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: ENV_CONFIG.SMTP_USER,
    pass: ENV_CONFIG.SMTP_PASS, // app password
  },
});

export const verifyMailServerConnection = async () => {
  try {
    await transporter.verify();
    console.log("server is ready to send emails.");
  } catch (error) {
    console.log("mail server connection failed.");
    console.log(error);
  }
};
export default transporter;
