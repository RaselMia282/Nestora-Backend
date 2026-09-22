import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utilis/catchAsync";
import { registerUserSchema } from "./auth.validation";
import { authService } from "./auth.service";
import { sendResponse } from "../utilis/sendResponse";
import httpStatus from "http-status";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = registerUserSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }

    const result = await authService.registerUserIntoDb(payload.data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successful",
      data: result,
    });
  },
);

export const authController = {
  registerUser,
};
