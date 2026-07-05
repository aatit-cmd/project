import express from "express";

import { login, register } from "../controllers/auth.controller";

const router = express.Router()

//* register
router.post("/register",register);

router.post("/login",login);


//* login
// router.post("/login",login);


export default router;