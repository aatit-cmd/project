import mongoose from "mongoose";

// user schema
const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "full_name is required"],
      minLength: [3, "name must be at least 3 character long"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, " user already exists with provided email"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    profile_image: {
      type: String,
    },
    role:{
        type: String,
        enum : ["USER", "ADMIN", "SUPER ADMIN"],
        default : "USER",
    },
    phone: {
      type: String,
      required: false,
      maxLength: [10, "phone number at most be 10 digit long"],
    },
  },
  { timestamps: true },
);

//* user model

const User = mongoose.model("user", userSchema);

export default User;
