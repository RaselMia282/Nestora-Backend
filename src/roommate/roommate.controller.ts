import { Request, Response } from "express";
import { sendResponse } from "../utilis/sendResponse";
import { catchAsync } from "../utilis/catchAsync";
import httpStatus from "http-status";
import { roommateService } from "./roommate.service";
import { createRoommateProfileSchema } from "./roommate.validation";
const createRoommateProfile = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const payload = createRoommateProfileSchema.safeParse(req.body);

    if (!payload.success) {
      throw new Error("Invalid roommate profile data");
    }

    const result = await roommateService.createRoommateProfileIntoDB(
      userId,
      payload.data,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Roommate profile created successfully",
      data: result,
    });
  },
);



const getMyRoommateProfile = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("You are not authenticated");
    }

    const result = await roommateService.getMyRoommateProfileIntoDB(
      userId,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My roommate profile retrieved successfully",
      data: result,
    });
  },
);

export const RoommateController = {
  createRoommateProfile,
  getMyRoommateProfile,
};
