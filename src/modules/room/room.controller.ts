import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { createRoomSchema } from "./room.validation";
import { roomService } from "./room.service";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from "http-status";

const createRoom = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id;

    if (!ownerId) {
      throw new Error("Owner is not authenticated");
    }

    const payload = createRoomSchema.safeParse(req.body);

    if (!payload.success) {
      throw new Error(payload.error.message);
    }

    const result = await roomService.createRoomIntoDB(
      ownerId as string,
      payload.data,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Room created successfully",
      data: result,
    });
  },
);

const getAllRoom = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
          const result = await roomService.getAllRoomIntoDB(req.query)

           sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Room fetched successfully",
      data: result,
    });
          
})

export const roomController = {
  createRoom,
  getAllRoom,
};
