import { Role } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { CreateRoommatePayload, UpdateRoommatePayload } from "./roommate.interface";

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

export const roommateService = {
  createRoommateProfileIntoDB,
  getMyRoommateProfileIntoDB,
  updateRoommateProfileIntoDB,
};
