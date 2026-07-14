import mongoose from "mongoose";
import ImageSchema from "./image.model";


//* Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      minLength: 2,
      maxLength: 100,
    },

    description: {
      type: String,
      trim: true,
      minLength: 5,
      maxLength: 500,
    },

    logo: {
      type: ImageSchema,
      required: [true, "Logo is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

//* Category Model
const Category = mongoose.model("category", categorySchema);

export default Category;
