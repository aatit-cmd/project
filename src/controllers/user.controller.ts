import { Request, Response, NextFunction} from 'express';
import User from '../models/user.model';
import appError from '../utils/appError.utils';
import { Role } from '../types/enum.types';


// get all

export const getAll = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const users = await User.find({role : Role.USER});

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

// get all admins

export const getAllAdmins = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const admins = await User.find({role: {
            $in : [Role.ADMIN,Role.SUPER_ADMIN]
        }});

        res.status(200).json({
            message:"All users fetched",
            status : "success",
            success : true,
            data : admins

        })
    }
    catch (error){
        next (error)
    }
}

// get byid
export const getById = async (req: Request, res: Response, next: NextFunction) =>{
    try{
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
    }
    catch(error){
        next(error)
    }
}
