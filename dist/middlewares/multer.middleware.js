"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const uploader = () => {
    const folder = "uploads/";
    const fileSize = 5 * 1024 * 1024;
    if (!fs_1.default.existsSync(folder)) {
        fs_1.default.mkdirSync(folder, { recursive: true });
    }
    // multer disk storage
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
        },
    });
    // file filter
    const fileFilter = (req, file, callback) => {
        const allowed_mime_type = [
            'image/jpg',
            'image/jpeg',
            'image/png',
            'image/svg+xml',
            'doc/pdf',
            'image/webp',
            'image/avif'
        ];
        if (!allowed_mime_type.includes(file.mimetype)) {
            callback(new appError_utils_1.default(`${file.mimetype} is not allowed`, 422));
        }
        else {
            callback(null, true);
        }
    };
    // multer upload instance
    const upload = (0, multer_1.default)({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: fileSize,
        },
    });
    return upload;
};
exports.uploader = uploader;
