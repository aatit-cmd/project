import moongoose from "mongoose";
import ImageSchema from "./image.model";
//* product schema

const productSchema = new moongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price must be at least 0"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [30, "Product description must be at least 30 characters"],
      maxlength: [1000, "Product description must be at most 1000 characters"],
    },
    cover_image: {
      type: ImageSchema,
      required: [true, "Product cover image is required"],
    },
    // category : 1231423525 => {}
    category: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Product category is required"],
    },
    brand: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "brand",
      required: [true, "Product brand is required"],
    },
    images: [
      {
        type: ImageSchema,
        default: null,
      },
    ],
    new_arrival: {
      type: Boolean,
      default: false,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

//* product model
const Product = moongoose.model("Product", productSchema);

export default Product;
