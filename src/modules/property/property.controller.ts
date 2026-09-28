import { NextFunction, Request,Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";

const createProperty = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})

export const propertyController = {
    createProperty,
}