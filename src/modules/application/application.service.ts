import { RoomStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreateApplication,
  IUpdateApplication,
  IUpdateApplicationByOwner,
} from "./application.interface";

// const createApplicationIntoDB = async (
//   tenantId,
//   payload: ICreateApplication,
// ) => {
//   const { listingId } = payload;

//   // const isListingExists = await prisma.listing.findUnique({
//   //   where: { id: listingId },
//   //   include: {
//   //     room: true,
//   //   },
//   // });

//   const isRoomExists = await prisma.room.findUnique({
//     where: { id: listingId }, // listingId-তে আমরা রুমের আইডি পাঠাচ্ছি
// });
//   if (!isRoomExists) {
//     throw new Error("Listing does not exist");
//   }

//   if (!isRoomExists.isPublished) {
//     throw new Error("This listing is not available");
//   }

//   if (isListingExists.room.status !== RoomStatus.AVAILABLE) {
//     throw new Error("This room is not available for booking");
//   }

//   const isApplicationExists = await prisma.application.findFirst({
//     where: { tenantId, roomId: isListingExists.roomId },
//     include: {
//       room: true,
//     },
//   });

//   if (isApplicationExists) {
//     throw new Error("You have already applied for this room");
//   }

//   const result = await prisma.application.create({
//     data: {
//       tenantId,
//       roomId: isListingExists.roomId,
//     },
//     include: {
//       room: true,
//     },
//   });

//   return result;
// };

const createApplicationIntoDB = async (
  tenantId: string,
  payload: { listingId: string; type: "room" | "property" },
) => {
  const { listingId, type } = payload;

  let roomId: string | null = null;
  let propertyId: string | null = null;

  if (type === "room") {
    const room = await prisma.room.findUnique({ where: { id: listingId } });
    if (!room) throw new Error("Room does not exist");
    if (room.status !== RoomStatus.AVAILABLE)
      throw new Error("This room is not available");
    roomId = room.id;
    propertyId = room.propertyId;
  } else {
    const property = await prisma.property.findUnique({
      where: { id: listingId },
    });
    if (!property) throw new Error("Property does not exist");
    propertyId = property.id;
  }

  const isApplicationExists = await prisma.application.findFirst({
    where: {
      tenantId,
      ...(roomId ? { roomId } : { propertyId }),
    },
  });
  if (isApplicationExists)
    throw new Error("You have already applied for this listing");

  const result = await prisma.application.create({
    data: {
      tenantId,
      roomId,
      propertyId,
    },
    include: { room: true, property: true },
  });

  return result;
};

// const getApplicationIntoDB = async (tenantId: string,role:string) => {
//   const result = await prisma.application.findMany({
//     where: { tenantId: tenantId },
//     include: {
//       room: {
//         include: {
//           property: true,
//         },
//       },
//       property: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   return result;
// };

const getApplicationIntoDB = async (userId: string, role: string) => {
  let whereClause: any = {};

  if (role === "TENANT") {
    whereClause = { tenantId: userId };
  } else if (role === "OWNER") {
    whereClause = { room: { property: { ownerId: userId } } };
  }

  const result = await prisma.application.findMany({
    where: whereClause,
    include: {
      tenant: {
        include: {
          profile: true,
        },
      },
      room: {
        include: {
          property: true,
        },
      },
      property: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSingleApplicationIntoDB = async (tenantId, applicationId) => {
  const result = await prisma.application.findFirst({
    where: {
      tenantId,
      id: applicationId,
    },
    include: {
      room: {
        include: {
          property: true,
        },
      },
    },
  });

  if (!result) {
    throw new Error("Application not found");
  }

  return result;
};

const updateApplicationIntoDB = async (
  tenantId,
  applicationId,
  payload: IUpdateApplication,
) => {
  const application = await prisma.application.findFirst({
    where: {
      tenantId,
      id: applicationId,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.status !== "PENDING") {
    throw new Error("Only pending application can be cancelled");
  }

  const result = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: payload.status,
    },
  });

  return result;
};

const deleteApplicationIntoDB = async (tenantId, applicationId) => {
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      tenantId,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.status !== "PENDING") {
    throw new Error("Only pending application can be deleted");
  }

  const result = await prisma.application.delete({
    where: {
      id: applicationId,
    },
  });

  return result;
};

const updateApplicationStatusByOwnerIntoDB = async (
  userId: string,
  role: string,
  applicationId: string,
  payload: IUpdateApplicationByOwner,
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      room: { include: { property: true } },
      property: true,
    },
  });

  if (!application) throw new Error("Application not found");

  if (role !== "ADMIN") {
    const ownerId =
      application.room?.property?.ownerId || application.property?.ownerId;
    if (ownerId !== userId) throw new Error("You are not authorized");
  }

  if (application.status !== "PENDING") {
    throw new Error("Only pending applications can be processed");
  }

  
  const result = await prisma.application.update({
    where: { id: applicationId },
    data: { status: payload.status },
  });

  
  if (payload.status === "APPROVED") {
    
    const rentAmount = application.room
      ? Number(application.room.baseRent)
      : Number(application.property?.fullRent || 0);

    
    const securityDeposit = rentAmount * 2;

    
    const lease = await prisma.lease.create({
      data: {
        applicationId: application.id,
        monthlyRent: rentAmount,
        securityDeposit: securityDeposit,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: "ACTIVE",
        isSigned: true, 
      },
    });

    
    await prisma.payment.create({
      data: {
        leaseId: lease.id,
        tenantId: application.tenantId,
        amount: rentAmount, 
        transactionId: `txn_${Date.now()}`, 
        status: "PENDING",
        paymentMethod: "CREDIT_CARD",
      },
    });
  }

  return result;
};

export const applicationService = {
  createApplicationIntoDB,
  getApplicationIntoDB,
  getSingleApplicationIntoDB,
  updateApplicationIntoDB,
  deleteApplicationIntoDB,
  updateApplicationStatusByOwnerIntoDB,
};
