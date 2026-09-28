// import { TokenPayload } from "google-auth-library";
import ejs from "ejs"

// import { prismaVersion } from "../generated/prisma/internal/prismaNamespace";
import crypto from "crypto"
import bcrypt from "bcryptjs";
import { IForgotPassword, IGoogleLogin, Ilogin, IRegisterUser, IResetPassword } from "./auth.interface";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { jwtUtilis } from "../../utilis/jwt";
import { googleClient } from "../../lib/googleAuth";
import { AuthProvider, Role } from "../../generated/prisma/enums";
import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../lib/cloudinary";
import { redisClient } from "../../lib/redis";
import path from "path";
import { transporter } from "../../lib/nodemailer";
import { TokenPayload } from "google-auth-library";


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

const updateProfileImgIntoDB = async (userId: string, buffer: Buffer) => {
  if (!buffer) {
    throw new Error("File buffer is required!");
  }

  const cloudinaryResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "profile_pictures",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(new Error("No result returned from Cloudinary"));
          }
          resolve(result);
        },
      );

      uploadStream.end(buffer);
    },
  );

  const updatedProfile = await prisma.profile.update({
    where: {
      userId: userId,
    },
    data: {
      avatarUrl: cloudinaryResult.secure_url,
      avatarPublicId: cloudinaryResult.public_id,
    },
  });

  return updatedProfile;
};

const forgotPasswordIntoDB = async (payload: IForgotPassword) => {
  const { email } = payload;

  const isUserExists = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
    },
  });
  if (!isUserExists) {
    throw new Error("User does not exists");
  }
  if (isUserExists.status === "SUSPENDED") {
    throw new Error("User is suspend");
  }

  if (isUserExists.googleId || isUserExists.authProvider === "GOOGLE") {
    throw new Error("Please login with email");
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  const key = `forgot-password:${isUserExists.email}`;

  const expirationMinutes = 5;

  await redisClient.set(key, otp, {
    expiration: {
      type: "EX",
      value: expirationMinutes*60,
    },
  });

  const templatePath = path.join(
    process.cwd(),
    "src/templates/forgot-password.ejs",
  );

  const html = await ejs.renderFile(templatePath, {
    name: `${isUserExists.profile?.firstName ?? ""} ${isUserExists.profile?.lastName ?? ""}`.trim(),
    otp,
    expirationMinutes: expirationMinutes,
  });

  //  nodemailer for sending email
  await transporter.sendMail({
    from: config.email_sender,
    to: isUserExists.email,
    subject: "Forgot Password",
    html,
  });
};

const resetPasswordIntoDB = async (payload: IResetPassword) => {
  const { newPassword, email, otp } = payload;
  const key = `forgot-password:${email}`;
  const savedOtp = await redisClient.get(key);
  if (!savedOtp) {
    throw new Error("OTP has expired");
  }

  if (savedOtp !== otp) {
    throw new Error("Invalid otp");
  }
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
    },
  });

  await redisClient.del(key);

  // password reset sucess message
  const templatePath = path.join(
    process.cwd(),
    "src/templates/reset-password-success.ejs",
  );

  const html = await ejs.renderFile(templatePath, {
    name: `${user.profile?.firstName ?? ""} ${
      user.profile?.lastName ?? ""
    }`.trim(),
  });

  await transporter.sendMail({
    from: config.email_sender,
    to: user.email,
    subject: "Reset Password",
    html,
  });
};

export const authService = {
  registerUserIntoDb,
  loginUserIntoDB,
  getMyProfileIntoDB,
  googleLoginIntoDB,
  updateProfileImgIntoDB,
  forgotPasswordIntoDB,
  resetPasswordIntoDB,
};
