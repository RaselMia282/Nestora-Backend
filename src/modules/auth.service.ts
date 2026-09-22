import config from "../config";
import { prismaVersion } from "../generated/prisma/internal/prismaNamespace";
import { prisma } from "../lib/prisma";
import { IRegisterUser } from "./auth.interface";
import bcrypt from "bcryptjs";

const registerUserIntoDb = async (payload: IRegisterUser) => {
  const { email, password, role, firstName, lastName, phone, gender } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });
  if (isUserExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await prisma.$transaction(async (tx) => {
    const createUser = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
      omit: {
        password: true,
      },
    });

    const profile = await tx.profile.create({
      data: {
        firstName,
        lastName,
        phone,
        gender,
        userId: createUser.id,
      },
    });
    return {
      id: createUser.id,
      email: createUser.email,
      role: createUser.role,
      profile,
    };
  });
  return result;
};

export const authService = {
  registerUserIntoDb,
};
