import express from "express";

import { login, register } from "../controllers/auth.controller";

import { uploader } from "../middlewares/multer.middleware";
const router = express.Router()

// const upload = multer({dest:'uploads/'})
const upload = uploader()

router.post("/register", upload.single("profile_image"), register);


//* register
router.post("/register",register);

//* login
router.post("/login",login);



// router.post("/login",login);


export default router;