// product: id, user: id

// {user:user_id, items[{product:product_id, quantity:number}]}

import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
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

const wishlist = mongoose.model("wishlist", wishlistSchema);

export default wishlist;
