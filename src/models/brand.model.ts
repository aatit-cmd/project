import mongoose  from "mongoose";
import { IImage } from "../types/gloabal.types";
import ImageSchema from "./image.model";

export interface IBrand extends Document {
  name: string;
  description?: string;
  logo: IImage;
}

// brand schema (name ,description, logo)
const brandSchema = new mongoose.Schema({
    name:{
        type : String,
        required : [true, "brand_name is required"],
        minLength: [3, "name must be at least 3 character long"],
        trim: true,
    },
    description : {
        type : String,
        required : [true,"description is required"],
        minLength: [3, "name must be at least 3 character long"],
        trim: true,
    },
    logo : {
        type : ImageSchema,
        required : [true, "logo is required"],

    }
})

// brand model
const Brand = mongoose.model("brand",brandSchema);

export default Brand;