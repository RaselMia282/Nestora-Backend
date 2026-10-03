import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { createApplicationSchema } from "./application.validation";
import { sendResponse } from "../../utilis/sendResponse";
import { applicationService } from "./application.service";
import httpStatus from "http-status";

const createApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user.id;
    const payload = createApplicationSchema.safeParse(req.body);
    if (!tenantId) {
      throw new Error("Tenant is not authenticated");
    }

    if (!payload.success) {
      throw new Error(payload.error.message);
    }
    const result = await applicationService.createApplicationIntoDB(
      tenantId,
      payload.data,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Application submitted successfully",
      data: result,
    });
  },
);

const getApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getSingleApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updateApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deleteApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const applicationController = {
  createApplication,
  getApplication,
  getSingleApplication,
  updateApplication,
  deleteApplication,
};
