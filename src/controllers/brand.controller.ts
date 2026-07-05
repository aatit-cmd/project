import {Request, Response, NextFunction } from "express";

import Brand from "../models/brand.model";
import appError from "../utils/appError.utils";

// getAll
export const getAll = async (req : Request, res : Response, next : NextFunction) => {
   try{
     const brands = await Brand.find();

    res.status(200).json({
        message: "all the brands fetched",
        status : "success",
        success : true,
        data : brands
    })
    }
    catch (error){
        next(error);
    }
}

// getById
export const getById = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {id} = req.params;

        const brand = await Brand.findById({_id : id});

        if(!brand){
            return new appError("Brand by id not found",404)
        }

        res.status(200).json({
            message: "brand fetched",
            status : "success",
            success : true,
            data : brand
        })
    }
    catch (error){
        next(error)
    }
}

export const create = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {name, description, logo} = req.body;

        if(!name){
            throw new appError("Brand_name is required",400)
        }
         if(!description){
            throw new appError("Description is required",400)
        }
         if(!logo){
            throw new appError("logo is required",400)
        }

        const newBrand = await Brand.create({name, description, logo});

        res.status(201).json({
            message: "brand created",
            status : "success",
            success : true,
            data : newBrand
        })
    }
    catch(error){
        next (error)
    }
}

export const update = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {id} = req.params;
        
        const {name, description, logo} = req.body;

        if(!name){
            throw new appError("Brand_name is required",400)
        }
         if(!description){
            throw new appError("Description is required",400)
        }
         if(!logo){
            throw new appError("logo is required",400)
        }

        const updateBrand = await Brand.findByIdAndUpdate({_id: id},{name,description,logo},{new:true})

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
    catch (error){
        next (error)
    }
}

export const remove = async (req : Request, res : Response, next : NextFunction) => {
    try {
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
    catch (error){
        next (error);
    }
}