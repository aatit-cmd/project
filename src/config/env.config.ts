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
};

export default ENV_CONFIG;
