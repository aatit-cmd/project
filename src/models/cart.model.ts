import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user_id is required"],
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "product_id is required"],
        },
        quantity: {
          type: Number,
          required: [true, "quantity is required"],
          minLength: [1, "quantity cannot be less than 1"],
          default: 1,
        },
      },
    ],
  },
  { timestamps: true },
);

const cart = mongoose.model("cart", cartSchema);

export default cart;
