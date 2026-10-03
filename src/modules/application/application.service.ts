import { RoomStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateApplication } from "./application.interface";

const createApplicationIntoDB = async (
  tenantId,
  payload: ICreateApplication,
) => {
  const { listingId } = payload;

  const isListingExists = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      room: true,
    },
  });
  if (!isListingExists) {
    throw new Error("Listing does not exist");
  }

  if (!isListingExists.isPublished) {
    throw new Error("This listing is not available");
  }

  if (isListingExists.room.status !== RoomStatus.AVAILABLE) {
    throw new Error("This room is not available for booking");
  }

  const isApplicationExists = await prisma.application.findFirst({
    where: { tenantId, roomId: isListingExists.roomId },
    include: {
      room: true,
    },
  });

  if (isApplicationExists) {
    throw new Error("You have already applied for this room");
  }

  const result = await prisma.application.create({
    data: {
      tenantId,
      roomId: isListingExists.roomId,
    },
    include: {
      room: true,
    },
  });

  return result;
};

const getApplicationIntoDB = async () => {};

const getSingleApplicationIntoDB = async () => {};

const updateApplicationIntoDB = async () => {};

const deleteApplicationIntoDB = async () => {};

export const applicationService = {
  createApplicationIntoDB,
  getApplicationIntoDB,
  getSingleApplicationIntoDB,
  updateApplicationIntoDB,
  deleteApplicationIntoDB,
};
