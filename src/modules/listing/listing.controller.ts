import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { createListingSchema } from "./listning.validation";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from "http-status";
import { listingService } from "./listing.service";
import { prisma } from "../../lib/prisma";

const createListing = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id;

    if (!ownerId) {
      throw new Error("Owner is not authenticated");
    }

    const payload = createListingSchema.safeParse(req.body);

    if (!payload.success) {
      throw new Error(payload.error.message);
    }

    const result = await listingService.createListingIntoDB(
      ownerId,
      payload.data,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Listing created successfully",
      data: result,
    });
  },
);

const getAllListing = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query;
    const result = await listingService.getAllListingIntoDB(query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Listings fetched successfully",
      data: result,
    });
  },
);

const getSingleListing = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updateListing = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deleteListing = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const uploadListingImg = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const listingController = {
  createListing,
  getAllListing,
  getSingleListing,
  updateListing,
  deleteListing,
  uploadListingImg,
};
