import config from "../config";
// import { prismaVersion } from "../generated/prisma/internal/prismaNamespace";
import { prisma } from "../lib/prisma";
import { jwtUtilis } from "../utilis/jwt";
import { Ilogin, IRegisterUser } from "./auth.interface";
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

const loginUserIntoDB = async (payload: Ilogin) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }
  if (!user.password) {
    throw new Error("Please login with your Google account");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("incorrect password");
  }

  // jwt create
  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  // accessToken
  const accessToken = jwtUtilis.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );

  //  refreshToken
  const refreshToken = jwtUtilis.createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expire_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  registerUserIntoDb,
  loginUserIntoDB,
};
