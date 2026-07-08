import express from "express";

import { login, register } from "../controllers/auth.controller";

import multer from "multer";

const router = express.Router()

const upload = multer({dest:'uploads/'})

//* register
router.post("/register",register);

//* login
router.post("/login",login);



// router.post("/login",login);


export default router;