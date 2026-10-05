import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import {
  createApplicationSchema,
  updateApplicationByOwnerSchema,
  updateApplicationSchema,
} from "./application.validation";
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
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    if (!tenantId) {
      throw new Error("Tenant is not authenticated");
    }

    const result = await applicationService.getApplicationIntoDB(tenantId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Application retrieved  successfully",
      data: result,
    });
  },
);

const getSingleApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    const applicationId = req.params;

    const result = await applicationService.getSingleApplicationIntoDB(
      tenantId,
      applicationId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Application retrieved  successfully",
      data: result,
    });
  },
);

const updateApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    const applicationId = req.params.id;

    const payload = updateApplicationSchema.safeParse(req.body);

    if (!payload.success) {
      throw new Error(payload.error.message);
    }

    const result = await applicationService.updateApplicationIntoDB(
      tenantId,
      applicationId,
      payload.data,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Application updated successfully",
      data: result,
    });
  },
);

const deleteApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    const applicationId = req.params.id;

    if (!tenantId) {
      throw new Error("Tenant is not authenticated");
    }

    await applicationService.deleteApplicationIntoDB(applicationId, tenantId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Application deleted successfully",
      data: null,
    });
  },
);

const updateApplicationStatusByOwner = catchAsync(
  async (req: Request, res: Response) => {
    const ownerId = req.user?.id;

    const applicationId = req.params.id as string;

    const payload = updateApplicationByOwnerSchema.safeParse(req.body);

    if (!payload.success) {
      throw new Error(payload.error.message);
    }

    const result =
      await applicationService.updateApplicationStatusByOwnerIntoDB(
        ownerId,
        applicationId,
        payload.data,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Application status updated successfully",
      data: result,
    });
  },
);

export const applicationController = {
  createApplication,
  getApplication,
  getSingleApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatusByOwner,
};
