import { VerificationStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateIdentityVerification } from "./verification.interface";

import { uploadToCloudinary } from "../../lib/cloudinaryUpload";

const verifyIdentityIntoDB = async (
  userId,
  payload: ICreateIdentityVerification,
  nidFront,
  nidBack,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      identityVerification: true,
    },
  });
  if (!user) {
    throw new Error("User account not found");
  }
  if (user.status === "BLOCKED") {
    throw new Error("User is bolocked");
  }
  if (user.status === "DELETED") {
    throw new Error("User is deleted");
  }

  if (user.status === "SUSPENDED") {
    throw new Error("User is suspended");
  }

  if (user.identityVerification?.status === VerificationStatus.PENDING) {
    throw new Error("Your verification request is already pending approval");
  }

  const isExistsNid = await prisma.identityVerification.findUnique({
    where: { nidNumber: payload.nidNumber },
  });

  if (isExistsNid && isExistsNid.userId! == userId) {
    throw new Error(
      "This NID number is already associated with another account",
    );
  }

  const fontUpload = await uploadToCloudinary(
    nidFront.buffer,
    "nestora/identity-verifications",
  );
  const backUpload = await uploadToCloudinary(
    nidBack.buffer,
    "nestora/identity-verifications",
  );

  if (!fontUpload?.secure_url || !backUpload?.secure_url) {
    throw new Error("Failed to upload NID images. Please try again.");
  }

  const result = await prisma.identityVerification.upsert({
    where: { userId },
    update: {
      nidNumber: payload.nidNumber,
      nidFrontUrl: fontUpload.secure_url,
      nidFrontPublicId: fontUpload.public_id,
      nidBackUrl: backUpload.secure_url,
      nidBackPublicId: backUpload.public_id,
      status: VerificationStatus.PENDING,
    },

    create: {
      userId,
      nidNumber: payload.nidNumber,
      nidFrontUrl: fontUpload.secure_url,
      nidFrontPublicId: fontUpload.public_id,
      nidBackUrl: backUpload.secure_url,
      nidBackPublicId: backUpload.public_id,
      status: VerificationStatus.PENDING,
    },
  });
  return result;
};

const getMyVerificationIntoDB = async (userId: string) => {
  const result = await prisma.identityVerification.findUnique({
    where: {  userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  return result;
};

export const verificationService = {
  verifyIdentityIntoDB,
  getMyVerificationIntoDB,
};
