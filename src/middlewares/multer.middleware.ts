import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import { Request } from "express";
import AppError from "../utils/appError.utils";

export const uploader = () => {
    const folder = "uploads/";
    const fileSize = 5 * 1024 * 1024;

    if (!fs.existsSync(folder)){
        fs.mkdirSync(folder, {recursive : true})
    }

    // multer disk storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
  });

  // file filter
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    const allowed_mime_type = [
        'image/jpg',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
        'doc/pdf',
        'image/webp',
        'image/avif'

    ]
    if (!allowed_mime_type.includes(file.mimetype)){
        callback (new AppError(`${file.mimetype} is not allowed`,422))
    }else{
        callback(null ,true);
    }
  };

  // multer upload instance
  const upload = multer({
    storage: storage,
    fileFilter : fileFilter,
    limits: {
      fileSize: fileSize,
    },
  });

  return upload;
};

