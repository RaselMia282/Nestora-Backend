import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilis/catchAsync";
import { createRoomSchema, updateRoomSchema } from "./room.validation";
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

const getAllRoom = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await roomService.getAllRoomIntoDB(req.query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Room fetched successfully",
      data: result,
    });
  },
);

const getSingleRoom = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await roomService.getSingleRoomIntoDB(id as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Room fetched successfully",
      data: result,
    });
  },
);

const updateRoom = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = await updateRoomSchema.safeParse(req.body);
    const ownerId = req.user.id;
    const roomId = req.params;

    if (!payload.success) {
      throw new Error(payload.error.message);
    }

    const result = await roomService.updateRoomIntoDB(
      payload.data,
      ownerId as string,
      roomId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Room updated successfully",
      data: result,
    });
  },
);

const deleteRoom = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const roomId = req.params;
    const ownerId = req.user.id;

    const result = await roomService.deleteRoomIntoDB(roomId, ownerId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Room deleted successfully",
      data: result,
    });
  },
);

const uploadRoomImg = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const roomId = req.params;
    const ownerId = req.user.id;
    const file = req.file;

    if (!req.file) {
      throw new Error("Please upload an image file");
    }

    const result = await roomService.updateRoomIntoDB(
      roomId,
      ownerId,
      file.buffer,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Room image uploaded successfully",
      data: result,
    });
  },
);

export const roomController = {
  createRoom,
  getAllRoom,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  uploadRoomImg,
};
