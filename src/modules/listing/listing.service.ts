import { prisma } from "../../lib/prisma";
import { ICreateListing } from "./listing.interface";

const createListingIntoDB = async (
  ownerId: string,
  payload: ICreateListing,
) => {
  const { roomId, title, description } = payload;

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      property: true,
    },
  });

  if (!room) {
    throw new Error("Room does not exist");
  }

  if (room.property.ownerId !== ownerId) {
    throw new Error("You are not authorized to create listing");
  }

  const existListing = await prisma.listing.findUnique({
    where: { id: roomId },
  });

  if (existListing) {
    throw new Error("This room already has a listing");
  }

  const createListing = await prisma.listing.create({
    data: {
      title,
      description,
      roomId,
    },
  });

  return createListing;
};

const getAllListingIntoDB = async (query: any) => {
  const {
    roomType,
    status,
    page = 1,
    limit = 10,
    minRent,
    maxRent,
    search,
    sortOrder = "asc",
  } = query;

  // Pagination
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  // Where condition
  const where: any = {};

  // =========================
  // Room Filters
  // =========================

  if (roomType || status || minRent || maxRent) {
    where.room = {};

    // Room Type
    if (roomType) {
      where.room.roomType = roomType;
    }

    // Room Status
    if (status) {
      where.room.status = status;
    }

    // Rent Range
    if (minRent || maxRent) {
      where.room.baseRent = {};

      if (minRent) {
        where.room.baseRent.gte = Number(minRent);
      }

      if (maxRent) {
        where.room.baseRent.lte = Number(maxRent);
      }
    }
  }

  // =========================
  // Search
  // =========================

  if (search) {
    where.OR = [
      // Listing title
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },

      // Listing description
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },

      // Property title
      {
        room: {
          property: {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },

      // Property city
      {
        room: {
          property: {
            city: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },

      // Property address
      {
        room: {
          property: {
            address: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  // =========================
  // Sorting
  // =========================

  const order = sortOrder === "desc" ? "desc" : "asc";

  // =========================
  // Total Count
  // =========================

  const total = await prisma.listing.count({
    where,
  });

  const totalPages = Math.ceil(total / limitNumber);

  // =========================
  // Get Listings
  // =========================

  const listings = await prisma.listing.findMany({
    where,
    skip,
    take: limitNumber,

    orderBy: {
      room: {
        baseRent: order,
      },
    },

    include: {
      room: true,
    },
  });

  // =========================
  // Response
  // =========================

  return {
    meta: {
      pageNumber,
      limitNumber,
      totalPages,
      total,
    },
    data: listings,
  };
};

const getSingleListingIntoDB = async () => {};

const updateListingIntoDB = async () => {};

const deleteListingIntoDB = async () => {};

const uploadListingImgIntoDB = async () => {};

export const listingService = {
  createListingIntoDB,
  getAllListingIntoDB,
  getSingleListingIntoDB,
  updateListingIntoDB,
  deleteListingIntoDB,
  uploadListingImgIntoDB,
};
