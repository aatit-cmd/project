"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.upload = void 0;
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const appError_utils_1 = __importDefault(require("./appError.utils"));
const fs_1 = __importDefault(require("fs"));
//* upload
const upload = async (file, dir = "/") => {
    try {
        const folder = "team_14" + dir;
        const { public_id, secure_url } = await cloudinary_config_1.default.uploader.upload(file.path, {
            unique_filename: true,
            folder: folder,
            transformation: {
                height: 1000,
                width: 1000,
                crop: "crop",
                fetch_format: "auto",
                format: "auto",
                gravity: "face",
            },
        });
        //* delete local file
        if (fs_1.default.existsSync(file.path)) {
            fs_1.default.unlinkSync(file.path);
        }
        return {
            public_id,
            path: secure_url,
        };
    }
    catch (error) {
        console.log(error);
        throw new appError_utils_1.default("something went wrong", 500);
    }
};
exports.upload = upload;
//* delete image
const deleteFile = async (public_id) => {
    try {
        await cloudinary_config_1.default.uploader.destroy(public_id);
        return true;
    }
    catch (error) {
        console.log(error);
        throw new appError_utils_1.default("something went wrong", 500);
    }
};
exports.deleteFile = deleteFile;
