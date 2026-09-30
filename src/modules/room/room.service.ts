import { prisma } from "../../lib/prisma";
import { ICreateRoom } from "./room.interface";

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

export const roomService = {
  createRoomIntoDB,
};
