import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utilis/catchAsync";
import { loginUserSchema, registerUserSchema } from "./auth.validation";
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

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = loginUserSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const { accessToken, refreshToken } = await authService.loginUserIntoDB(
      payload.data,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User login successful",
      data: {
        accessToken,
        refreshToken,
      },
    });
  },
);

export const authController = {
  registerUser,
  loginUser,
};
