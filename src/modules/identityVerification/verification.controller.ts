import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { createIdentityVerificationSchema } from "./verification.validation";
import { verificationService } from "./verification.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utilis/sendResponse";

const verifyIdentity = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("User is not authenticated");
    }
    const payload = createIdentityVerificationSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }

    const files = req.files as {
      nidFont?: Express.Multer.File[];
      nidBack?: Express.Multer.File[];
    };

    const nidFont = files.nidFont?.[0];
    const nidBack = files.nidBack?.[0];

    if (!nidFont || !nidBack) {
      throw new Error("Both nid images are required");
    }

    const result = await verificationService.verifyIdentityIntoDB(
      userId,
      payload.data,
      nidFont,
      nidBack,
      
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Identity verification submitted successfully",
      data: result,
    });
  },
);

export const verificationController = {
  verifyIdentity,
};
