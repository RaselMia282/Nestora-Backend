import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import {
  createPropertyCategorySchema,
  updatePropertyCategorySchema,
} from "./propertyCategory.validation";
import { propertyCategoryService } from "./propertyCategory.service";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from "http-status";

const createPropertyCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = createPropertyCategorySchema.safeParse(req.body);

    if (!payload.success) {
      throw new Error(payload.error.message);
    }

    const result = await propertyCategoryService.createPropertyCategoryIntoDB(
      payload.data,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property category created successfully",
      data: result,
    });
  },
);

const getAllPropertyCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await propertyCategoryService.getAllPropertyCategoryIntoDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property category fetched successfully",
      data: result,
    });
  },
);

const getPropertyCategoryById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await propertyCategoryService.getPropertyCategoryByIdIntoDB(
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Single property category fetched successfully",
      data: result,
    });
  },
);

const updatePropertyCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = updatePropertyCategorySchema.safeParse(req.body);

    if (!payload.success) {
      throw new Error(payload.error.message);
    }

    const result = await propertyCategoryService.updatePropertyCategoryIntoDB(
      id as string,
      payload.data,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message:"Property category updated successfully",
      data: result,
    });
  },
);

export const propertyCategoryController = {
  createPropertyCategory,
  getAllPropertyCategory,
  getPropertyCategoryById,
  updatePropertyCategory,
};
