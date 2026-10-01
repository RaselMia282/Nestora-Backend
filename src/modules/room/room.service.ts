import { prisma } from "../../lib/prisma";
import { ICreateRoom, IUpdateRoom } from "./room.interface";

const createRoomIntoDB = async (ownerId: string, payload: ICreateRoom) => {
  const { propertyId, roomNumber, roomType, baseRent } = payload;

  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new Error("Property does not exist");
  }

  if (property.ownerId !== ownerId) {
    throw new Error("You are not authorized");
  }

  const result = await prisma.room.create({
    data: {
      propertyId,
      roomNumber,
      roomType,
      baseRent,
    },
  });

  return result;
};

const getAllRoomIntoDB = async (query: any) => {
  const {
    propertyId,
    roomNumber,
    roomType,
    search,
    status,
    page = 1,
    limit = 10,
    minRent,
    maxRent,
    sortOrder = "asc",
  } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // search here
  const where: any = {};
  if (roomType) {
    where.roomType = roomType;
  }
  if (status) {
    where.status = status;
  }
  if (propertyId) {
    where.propertyId = propertyId;
  }
  if (roomNumber) {
    where.roomNumber = {
      contains: roomNumber,
      mode: "insensitive",
    };
  }
  if (minRent || maxRent) {
    where.baseRent = {};

    if (minRent) {
      where.baseRent.gte = Number(minRent);
    }
    if (maxRent) {
      where.baseRent.lte = Number(maxRent);
    }
  }

  if (search) {
    where.OR = [
      { roomNumber: { contains: search, mode: "insensitive" } },
      { property: { title: { contains: search, mode: "insensitive" } } },
      { property: { city: { contains: search, mode: "insensitive" } } },
      { property: { address: { contains: search, mode: "insensitive" } } },
    ];
  }

  const total = await prisma.room.count({ where });
  const totalPages = Math.ceil(total / limitNumber);

  const room = await prisma.room.findMany({
    where,
    take: limitNumber,
    skip,
    orderBy: {
      baseRent: sortOrder,
    },
  });
  return {
    meta: {
      limitNumber,
      totalPages,
      pageNumber,
      total,
    },
    data: room,
  };
};

const getSingleRoomIntoDB = async (id: string) => {
  const result = await prisma.room.findUnique({
    where: { id },
    include: {
      property: true,
      images: true,
    },
  });
  if (!result) {
    throw new Error("Room doest not exist");
  }

  return result;
};

const updateRoomIntoDB = async (
  payload: IUpdateRoom,
  ownerId: string,
  roomId,
) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      property: true,
      images: true,
    },
  });
  if (!room) {
    throw new Error("Room does not exist");
  }

  if (room.property.ownerId !== ownerId) {
    throw new Error("You are not authorized");
  }

  const updateRoom = await prisma.room.update({
    where: { id: roomId },
    data: payload,
  });

  return updateRoom;
};

const deleteRoomIntoDB = async (roomId, ownerId) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { property: true },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  if (room.property.ownerId !== ownerId) {
    throw new Error("You are not authorized to delete this room");
  }

  const deletedRoom = await prisma.room.delete({
    where: { id: roomId },
  });

  return deletedRoom;
};

const uploadRoomImgIntoDB = async () => {};

export const roomService = {
  createRoomIntoDB,
  getAllRoomIntoDB,
  getSingleRoomIntoDB,
  updateRoomIntoDB,
  deleteRoomIntoDB,
  uploadRoomImgIntoDB,
};
