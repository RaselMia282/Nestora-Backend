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

    const result = await paymentService.createPaymentsIntoDB(
      tenantId,
      payload.data,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment session created successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"];

    const result = await paymentService.handleWebhookIntoDB(
      event,
      signature as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Webhook processed successfully",
      data: result,
    });
  },
);


const getMyPayment = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
const tenantId = req.user?.id;

  const result = await paymentService.getMyPaymentIntoDB(tenantId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My payments retrieved successfully",
    data: result,
  });


})
export const paymentController = {
  createPayment,
  handleWebhook,
  getMyPayment,
};
