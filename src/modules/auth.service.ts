import { TokenPayload } from "google-auth-library";
import config from "../config";
import { googleClient } from "../lib/googleAuth";
// import { prismaVersion } from "../generated/prisma/internal/prismaNamespace";
import { prisma } from "../lib/prisma";
import { jwtUtilis } from "../utilis/jwt";
import { IGoogleLogin, Ilogin, IRegisterUser } from "./auth.interface";
import bcrypt from "bcryptjs";
import { AuthProvider, Role } from "../generated/prisma/enums";

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

const getMyProfileIntoDB = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
    },

    omit: {
      password: true,
    },
  });
  if (!result) {
    throw new Error("User not found!");
  }
  return result;
};

const googleLoginIntoDB = async (payload: IGoogleLogin) => {
  let googleUser: TokenPayload | null | undefined = null;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config.google_client_id,
    });

    googleUser = ticket.getPayload();
  } catch (error) {
    console.log("Google Verification Error:", error);
  }

  // check validation
  if (!googleUser || !googleUser.email) {
    throw new Error("Invalid Google token or email missing");
  }

  const email = googleUser.email;

  const googleId = googleUser.sub;
  const firstName = googleUser.given_name || googleUser.name || "GOOGLE USER";
  const lastName = googleUser.family_name || "";
  const picture = googleUser.picture;

  // find user in db
  let user = await prisma.user.findUnique({
    where: { email },
  });
  if (user && user.authProvider === AuthProvider.CREDENTIAL) {
    throw new Error(
      "An account already exists with this email. Please login using your password.",
    );
  }
  // if does not exists then create user and profile

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        role: Role.TENANT,
        authProvider: AuthProvider.GOOGLE,
        googleId,

        profile: {
          create: {
            firstName,
            lastName,
            avatarUrl: picture,
          },
        },
      },
    });
  } else if (!user.googleId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId,
        authProvider: AuthProvider.GOOGLE,
      },
    });
  }
};


const updateProfileImgIntoDB = async()=>{

}

export const authService = {
  registerUserIntoDb,
  loginUserIntoDB,
  getMyProfileIntoDB,
  googleLoginIntoDB,
  updateProfileImgIntoDB,
};
