import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { createPaymentSchema } from "./payments.validation";
import { paymentService } from "./payments.service";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from "http-status";
const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    const payload = createPaymentSchema.safeParse(req.body);

    const result = await paymentService.createPaymentsIntoDB(tenantId, payload.data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment session created successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createPayment,
};
