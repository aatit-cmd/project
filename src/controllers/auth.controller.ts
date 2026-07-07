import { Request, Response, NextFunction} from 'express';
import User from '../models/user.model';
import { comparePassword, hashPassword } from '../utils/bcrypt.utils';
import appError from '../utils/appError.utils';
import { catchAsync } from '../utils/catchAsync.utils';

//* register

export const register = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
    
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

})

//* login
export const login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        // email, password
        const {email, password} = req.body;
        if(!email){
            throw new appError("email is required",400);
        }
         if(!password){
            throw new appError("password is required",400)
        }


        // find user by email
        const user = await User.findOne({email : email}).select("+password");
        
        if(!user){
            throw new appError("credentials not matched",400)
        }

        // compare password
        const isPassMatched = await comparePassword(password, user.password)

        if(!isPassMatched){
            throw new appError("credentials not matched",400)
        }


        // todo: generate jwt token


        //* send success response
        res.status(201).json({
            message:"Login sucess",
            status : "success",
            success : true,
            data : user
        })
    
})

// get all
export const getAll = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const users = await User.find();

        res.status(200).json({
            message:"All users fetched",
            status : "success",
            success : true,
            data : users

        })
    }
    catch (error){
        next (error)
    }
}

// get byid
export const getById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) =>{
    
        const {id} = req.params;
        const user = await User.findById({_id : id});

        if (!user){
            throw new appError("user by id not matched",404)
        }
        res.status(200).json({
            message:"user fetched",
            status : "success",
            success : true,
            data : user

        })
})

//* get profile

//* change password

//* forgot password

//* change email