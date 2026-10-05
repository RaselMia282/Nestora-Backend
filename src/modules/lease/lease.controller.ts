import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { createLeaseSchema, updateLeaseSchema } from "./lease.validation";
import { leaseService } from "./lease.service";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from "http-status";

const createLease = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id;

    if (!ownerId) {
      throw new Error("Owner is not authenticated");
    }

    const payload = createLeaseSchema.safeParse(req.body);
    if (!payload.success) {
      throw new Error(payload.error.message);
    }

    const result = await leaseService.createLeaseIntoDB(ownerId, payload.data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Lease created successfully",
      data: result,
    });
  },
);

const getAllLease = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await leaseService.getAllLeaseIntoDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Lease fetched successfully",
      data: result,
    });
  },
);

const getSingleLease = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await leaseService.getSingleLeaseIntoDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Lease fetched successfully",
      data: result,
    });
  },
);

const updateLease = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id;
    const leaseId = req.params.id as string;
    const payload = updateLeaseSchema.safeParse(req.body);

    const result = await leaseService.updateLeaseIntoDB(
      ownerId,
      leaseId,
      payload.data,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Lease fetched successfully",
      data: result,
    });
  },
);

const terminateLease = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id;
    const leaseId = req.params.id as string;
    if (!ownerId) {
      throw new Error("Owner is not authenticated");
    }

    const result = await leaseService.terminateLeaseIntoDB(ownerId, leaseId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Lease terminate successfully",
      data: result,
    });
  },
);

const signLease = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    const leaseId = req.params.id as string;
    if (!tenantId) {
      throw new Error("Tenant is not authenticated");
    }

    const result = await leaseService.signLeaseIntoDB(tenantId, leaseId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Lease signed successfully",
      data: result,
    });
  },
);

export const leaseController = {
  createLease,
  getAllLease,
  getSingleLease,
  updateLease,
  terminateLease,
  signLease,
};
