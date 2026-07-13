import express from "express";

import { getAll, getAllAdmins, getById } from "../controllers/user.controller";


const router = express.Router()

//* get all 
router.get("/",getAll)

//* get all admin
router.get("/admins",getAllAdmins)

//* getById
router.get("/:id",getById)


export default router