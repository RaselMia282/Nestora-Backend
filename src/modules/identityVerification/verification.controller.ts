import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { createIdentityVerificationSchema } from "./verification.validation";
import { verificationService } from "./verification.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utilis/sendResponse";

const verifyIdentity = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User is not authenticated");
      }

      // FormData থেকে টেক্সট ফিল্ড বা বডি রিড করা (যদি থাকে)
      const payload = createIdentityVerificationSchema.safeParse(req.body || {});
      if (!payload.success) {
        console.error("🔥 ZOD VALIDATION ERROR:", payload.error.format());
        throw new Error("Invalid request body data");
      }

      const files = req.files as {
        nidFront?: Express.Multer.File[];
        nidBack?: Express.Multer.File[];
      };

      const nidFront = files?.nidFront?.[0];
      const nidBack = files?.nidBack?.[0];

      if (!nidFront || !nidBack) {
        console.error("🔥 FILE MISSING:", { nidFront: !!nidFront, nidBack: !!nidBack });
        throw new Error("Both NID images (nidFront and nidBack) are required");
      }

      const result = await verificationService.verifyIdentityIntoDB(
        userId,
        payload.data,
        nidFront,
        nidBack
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Identity verification submitted successfully",
        data: result,
      });
    } catch (error) {
      console.error("🔥 IDENTITY VERIFICATION FAILED:", error);
      throw error; 
    }
  }
);

const getMyVerification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("User is not authenticated");
    }

    const result = await verificationService.getMyVerificationIntoDB(
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My identity verification status retrieved successfully",
      data: result,
    });
  },
);

const getPendingVerification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await verificationService.getPendingVerificationIntoDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Pending verifications retrieved successfully",
      data: result,
    });
  },
);

const updateVarificationStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await verificationService.updateVarificationStatusIntoDB(
      id,
      status,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: `Identity verification ${status.toLowerCase()} successfully`,
      data: result,
    });
  },
);

export const verificationController = {
  verifyIdentity,
  getMyVerification,
  getPendingVerification,
  updateVarificationStatus,
};
