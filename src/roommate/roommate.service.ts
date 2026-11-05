import { UploadApiResponse } from "cloudinary";
import { Role } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import {
  CreateRoommatePayload,
  UpdateRoommatePayload,
} from "./roommate.interface";
import { cloudinary } from "../lib/cloudinary";
import { Prisma } from "../generated/prisma/client";

const createRoommateProfileIntoDB = async (
  userId: string,
  payload: CreateRoommatePayload,
) => {
  // 1. Check user exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUserExists) {
    throw new Error("User not found");
  }

  // 2. Check user role
  if (isUserExists.role !== Role.TENANT) {
    throw new Error("Only tenants can create roommate profiles");
  }

  // 3. Check existing roommate profile
  const isProfileExists = await prisma.roommateProfile.findUnique({
    where: {
      userId,
    },
  });

  if (isProfileExists) {
    throw new Error("Profile already exists");
  }

  // 4. Create roommate profile
  const createRoommate = await prisma.roommateProfile.create({
    data: {
      ...payload,
      userId,
      role: isUserExists.role,
      embedding: [],
    },
  });

  return createRoommate;
};

const getMyRoommateProfileIntoDB = async (userId: string) => {
  const result = await prisma.roommateProfile.findUnique({
    where: { userId },
  });

  if (!result) {
    throw new Error("Roommate profile not found");
  }

  return result;
};

const updateRoommateProfileIntoDB = async (
  userId: string,
  payload: UpdateRoommatePayload,
) => {
  // 1. Check existing profile
  const isProfileExists = await prisma.roommateProfile.findUnique({
    where: { userId },
  });

  if (!isProfileExists) {
    throw new Error("Roommate profile not found");
  }

  // 2. Update profile
  const result = await prisma.roommateProfile.update({
    where: { userId },
    data: payload,
  });

  return result;
};

// const updateRoommateProfileImgIntoDB = async (
//   userId: string,
//   buffer: Buffer,
// ) => {
//   const isUserExists = await prisma.user.findUnique({
//     where: { id: userId },
//   });
//   if (!isUserExists) {
//     throw new Error("User not exists");
//   }

//   const isProfileExists = await prisma.roommateProfile.findUnique({
//     where: { userId },
//   });

//   if (!isProfileExists) {
//     throw new Error("Roommate profile not found");
//   }

//   const cloudinaryResult = await new Promise<UploadApiResponse>(
//     (resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           resource_type: "auto",
//           folder: "roommate_profile_img",
//         },

//         (error, result) => {
//           if (error) {
//             return reject(error);
//           }

//           if (!result) {
//             return reject(new Error("No result returned from cloudinary "));
//           }
//           resolve(result);
//         },
//       );
//       uploadStream.end(buffer);
//     },
//   );

//   const updatedRoommateProfileImg = await prisma.roommateProfile.update({
//     where: { userId },
//     data: {
//       profileImg: cloudinaryResult.secure_url,
//       profileImgPublicId: cloudinaryResult.public_id,
//     },
//   });

//   return updatedRoommateProfileImg;
// };

const updateRoommateProfileImgIntoDB = async (
  userId: string,
  buffer: Buffer,
) => {
  // 1. Check user exists
  const isUserExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!isUserExists) {
    throw new Error("User not exists");
  }

  // 2. Check roommate profile exists
  const isProfileExists = await prisma.roommateProfile.findUnique({
    where: { userId },
  });

  if (!isProfileExists) {
    throw new Error("Roommate profile not found");
  }

  // 3. Store old image public id
  const oldPublicId = isProfileExists.profileImgPublicId;

  // 4. Upload new image
  const cloudinaryResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "roommate_profile_img",
        },

        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(new Error("No result returned from cloudinary"));
          }

          resolve(result);
        },
      );

      uploadStream.end(buffer);
    },
  );

  if (isProfileExists.profileImgPublicId) {
    try {
      await cloudinary.uploader.destroy(isProfileExists.profileImgPublicId);
    } catch (error) {
      console.error("Failed to delete old roommate profile image:", error);
    }
  }

  // 6. Update database
  const updatedRoommateProfileImg = await prisma.roommateProfile.update({
    where: { userId },
    data: {
      profileImg: cloudinaryResult.secure_url,
      profileImgPublicId: cloudinaryResult.public_id,
    },
  });

  return updatedRoommateProfileImg;
};

const getAllRoommatesIntoDB = async (currentUserId: string, query: any) => {
  const {
    page = 1,
    limit = 10,
    search,
    gender,
    budget,
    area,
    sort = "latest",
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const where: Prisma.RoommateProfileWhereInput = {
    NOT: { userId: currentUserId },
  };

  if (search) {
    where.OR = [
      { bio: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  // ৪. Filter: Gender
  if (gender) {
    where.gender = gender;
  }

  if (budget) {
    where.budget = {
      lte: Number(budget),
    };
  }

  if (area) {
    where.preferredArea = {
      contains: area,
      mode: "insensitive",
    };
  }

  const roommates = await prisma.roommateProfile.findMany({
    where,
    skip,
    take: Number(limit),
    orderBy: {
      createdAt: sort === "latest" ? "desc" : "asc",
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
    },
  });

  const total = await prisma.roommateProfile.count({
    where,
  });

  const totalPage = Math.ceil(total / Number(limit));

  return {
    data: roommates,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage,
    },
  };
};

const getSingleRoommateIntoDB = async (id: string) => {
  const result = await prisma.roommateProfile.findUnique({
    where: { id: id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
    },
  });

  if (!result) {
    throw new Error("Roommate profile not found");
  }

  return result;
};

export const roommateService = {
  createRoommateProfileIntoDB,
  getMyRoommateProfileIntoDB,
  updateRoommateProfileIntoDB,
  updateRoommateProfileImgIntoDB,
  getAllRoommatesIntoDB,
  getSingleRoommateIntoDB,
};
