import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import {
  createPropertySchema,
  getAllPropertiesQuerySchema,
} from "./property.validation";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from "http-status";

const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id;

    if (!ownerId) {
      throw new Error("Owner is not authenticated");
    }

    const payload = createPropertySchema.safeParse(req.body);

    if (!payload.success) {
      throw new Error(payload.error.message);
    }

    const result = await propertyService.createPropertyIntoDb(
      payload.data,
      ownerId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property created successfully",
      data: result,
    });
  },
);

const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = getAllPropertiesQuerySchema.safeParse(req.query);

    if (!query.success) {
      throw new Error(query.error.message);
    }

    const result = await propertyService.getAllPropertiesIntoDb();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties retrieved successfully",
      data: result,
    });
  },
);

export const propertyController = {
  createProperty,
  getAllProperties,
};
