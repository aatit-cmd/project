import "dotenv/config";

export const ENV_CONFIG = {
  //* environment
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  //* Database
  DB_URI: process.env.DB_URI!!,

  //* cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET:  process.env.CLOUDINARY_API_SECRET,

  //* jwt
  JWT_SECRET: process.env.JWT_SECRET!!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!!,

  //* nodemailer
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_SERVICE: process.env.SMTP_SERVICE,
  SMTP_PORT: Number(process.env.SMTP_PORT ?? "587"),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
};

export default ENV_CONFIG;
