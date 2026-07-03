import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { hashPassword } from '../utils/bcrypt.utils';
import appError from '../utils/appError.utils';

//* register

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { full_name, email, password, phone } = req.body;

        if(!full_name){
            // const error :any = new Error("full_name is required");
            // error.statusCode = 400;
            // error.status = "fail";
            // throw error;

            throw new appError("full_name is required", 400)
        }
        if(!email){
            // const error :any = new Error("email is required");
            // error.statusCode = 400;
            // error.status = "fail";
            // throw error;

            throw new appError("email is required",400);
        }
        if(!password){
            // const error :any = new Error("password is required");
            // error.statusCode = 400;
            // error.status = "fail";
            // throw error;

            throw new appError("password is required",400)
        }

        const user = new User({email, password, full_name, phone});

        // hash password
        const hashPass  = await hashPassword(password);
        user.password = hashPass;

        // handle profile image upload

        //! save user
        await user.save();


        //* success response
        res.status(201).json({
            message:"Account created",
            success : true,
            status : "success",
            data : user,
        })

    }
    catch (error){
        next(error);
    }
}

//* login

//* get profile

//* change password

//* forgot password

//* change email