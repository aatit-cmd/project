import {Request, Response, NextFunction } from "express";

import Brand from "../models/brand.model";
import appError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";

// getAll
export const getAll = catchAsync( 
    async (req : Request, res : Response, next : NextFunction) => {
   
     const brands = await Brand.find();

    res.status(200).json({
        message: "all the brands fetched",
        status : "success",
        success : true,
        data : brands
    })
    
})

// getByBrand
export const getById = catchAsync(
     async (req : Request, res : Response, next : NextFunction) => {
    
        const {brand} = req.params;

        const existingBrand = await Brand.findById({brand : brand});

        if(!existingBrand){
            return new appError("Brand  not found",404)
        }

        res.status(200).json({
            message: "brand fetched",
            status : "success",
            success : true,
            data : brand
        })
    
})

export const create =  catchAsync (
    async (req : Request, res : Response, next : NextFunction) => {

        const {name, description } = req.body;

        if(!name){
            throw new appError("Brand_name is required",400)
        }
         if(!description){
            throw new appError("Description is required",400)
        }
         
        const brand = new Brand({
            name,
            description
        })
        

        // Brand.save()

        res.status(201).json({
            message: "brand created",
            status : "success",
            success : true,
            data : brand
        })
    
})

export const update = catchAsync(
    async (req : Request, res : Response, next : NextFunction) => {
    
        const {id} = req.params;
        
        const {name, description} = req.body;

        if(!name){
            throw new appError("Brand_name is required",400)
        }
         if(!description){
            throw new appError("Description is required",400)
        }
         
        const updateBrand = await Brand.findByIdAndUpdate({_id: id},{name,description},{new:true})

        if (!updateBrand){
            throw new appError("Id not found to update",404)
        }

         res.status(201).json({
            message: "brand updated",
            status : "success",
            success : true,
            data : updateBrand
        })
    }
)

export const remove = catchAsync(
    async (req : Request, res : Response, next : NextFunction) => {
   
        const {id} = req.params;

        const deletedBrand = await Brand.findByIdAndDelete({_id : id});

        if(!deletedBrand){
            throw new appError("id not found to delete",404);
        }

        res.status(200).json({
            message: "brand deleted",
            status : "success",
            success : true,
            data : deletedBrand
        })
}
)