import mongoose, { Schema, Document } from "mongoose";

//* Interface
export interface ICategory extends Document {
  name: string;
  description?: string;
  logo: string;
}

//* Category Schema
const categorySchema = new Schema<ICategory>(
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
      minLength: 25,
      maxLength: 500,
    },

    logo: {
      type: String,
      required: [true, "Logo is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

//* Category Model
const Category = mongoose.model<ICategory>("category", categorySchema);

export default Category;
