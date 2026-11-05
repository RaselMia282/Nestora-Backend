import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utilis/sendResponse";
import { catchAsync } from "../utilis/catchAsync";
import httpStatus from "http-status";
import { roommateService } from "./roommate.service";
import {
  createRoommateProfileSchema,
  updateRoommateProfileSchema,
} from "./roommate.validation";

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

const getMyRoommateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error("You are not authenticated");
  }

  const result = await roommateService.getMyRoommateProfileIntoDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My roommate profile retrieved successfully",
    data: result,
  });
});

const updateRoommateProfile = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("You are not authenticated");
    }

    const payload = updateRoommateProfileSchema.safeParse(req.body);

    if (!payload.success) {
      throw new Error("Invalid roommate profile data");
    }

    const result = await roommateService.updateRoommateProfileIntoDB(
      userId,
      payload.data,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Roommate profile updated successfully",
      data: result,
    });
  },
);

const updateRoommateProfileImg = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const file = req.file;

    if (!userId) {
      throw new Error("You are not authenticated");
    }

    if (!file) {
      throw new Error("Please upload an image file");
    }

    const result = await roommateService.updateRoommateProfileImgIntoDB(
      userId,
      file.buffer,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile picture updated successfully",
      data: result,
    });
  },
);

const getAllRoommates = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      throw new Error("User not authenticated");
    }

    const result = await roommateService.getAllRoommatesIntoDB(
      currentUserId,
      req.query,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Roommates retrieved successfully",
      data: result,
    });
  },
);

const getSingleRoommate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await roommateService.getSingleRoommateIntoDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Roommate details retrieved successfully",
      data: result,
    });
  },
);

export const RoommateController = {
  createRoommateProfile,
  getMyRoommateProfile,
  updateRoommateProfile,
  updateRoommateProfileImg,
  getAllRoommates,
  getSingleRoommate,
};
