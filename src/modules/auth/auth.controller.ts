import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import { catchAsync } from "../../utilis/catchAsync";
import {
  forgotPasswordSchema,
  googleLoginSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
} from "./auth.validation";
import { authService } from "./auth.service";
import { sendResponse } from "../../utilis/sendResponse";
import {
  ACCESS_COOKIE_MAX_AGE,
  cookieOptions,
  REFRESH_COOKIE_MAX_AGE,
} from "../../utilis/cookie";

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

const logoutUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "lax" as const,
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logout successful",
      data: null,
    });
  },
);

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = loginUserSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const { accessToken, refreshToken, user } =
      await authService.loginUserIntoDB(payload.data);

    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "lax",
    //   maxAge: 1000 * 60 * 60 * 24,
    // });

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_COOKIE_MAX_AGE,
    });

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "lax",
    //   maxAge: 1000 * 60 * 60 * 24 * 30,
    // });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User login successful",
      data: {
        user,
      },
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    if (!id) {
      throw new Error("User not authenticated");
    }

    const result = await authService.getMyProfileIntoDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User profile fetched successfully",
      data: result,
    });
  },
);

const googleLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = googleLoginSchema.safeParse(req.body);

    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await authService.googleLoginIntoDB(payload.data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Google login successful",
      data: result,
    });
  },
);

const updateProfileImg = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const file = req.file;

    if (!file) {
      throw new Error("Please upload an image file");
    }
    const result = await authService.updateProfileImgIntoDB(
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

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = forgotPasswordSchema.safeParse(req.body);

    if (!payload.success) {
      throw new Error(payload.error.message);
    }

    const result = await authService.forgotPasswordIntoDB(payload.data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: `Password reset OTP send to your email successfully:${payload.data.email}`,
      data: result,
    });
  },
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = resetPasswordSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }

    const result = await authService.resetPasswordIntoDB(payload.data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password reset successfully! ",
      data: result,
    });
  },
);

export const authController = {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  googleLogin,
  updateProfileImg,
  forgotPassword,
  resetPassword,
};
