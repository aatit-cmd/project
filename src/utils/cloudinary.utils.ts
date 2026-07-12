import cloudinary from "../config/cloudinary.config";
import appError from "./appError.utils";
import fs from "fs";

//* upload
export const upload = async (file: Express.Multer.File, dir = "/") => {
  try {
    const folder = "team_14" + dir;
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      file.path,
      {
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
      },
    );

    //* delete local file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return {
      public_id,
      path: secure_url,
    };
  } catch (error) {
    console.log(error);
    throw new appError("something went wrong", 500);
  }
};

//* delete image

export const deleteFile = async (public_id: string) => {
  try {
    await cloudinary.uploader.destroy(public_id);
    return true;
  } catch (error) {
    console.log(error);
    throw new appError("something went wrong", 500);
  }
};
