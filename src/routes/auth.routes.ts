import express from "express";

import {
  changeProfileImage,
  login,
  register,
} from "../controllers/auth.controller";

import { uploader } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middlware";


const router = express.Router();

// const upload = multer({dest:'uploads/'})
const upload = uploader();

//* register
router.post("/register", upload.single("profile_image"), register);

//* login
router.post("/login", login);

// router.post("/login",login);
//* change profile image

//* change profile image
router.put(
  "/profile-image",
  upload.single("profile_image"),
  authenticate(),
  changeProfileImage,
);

//* logout
// router.post("/logout", logout);

//* get profile
// router.get("/profile", authenticate(), Profile);

export default router;
