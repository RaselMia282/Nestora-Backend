import { Request, Response, NextFunction } from "express";
import { Role } from "../generated/prisma/enums";
import { catchAsync } from "../utilis/catchAsync";
import { jwtUtilis } from "../utilis/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        id: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log("🔥 AUTH MIDDLEWARE HIT");

    const token = req.cookies?.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error(
        "You are not logged in.Please log in to access this resource",
      );
    }

    const verifyToken = jwtUtilis.verifyToken(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    console.log(verifyToken, "token-verified");

    if (!verifyToken) {
      throw new Error("Invalid token");
    }

    const { id, email, role } = verifyToken;
    console.log("Token payload role:", role);
    console.log("Required roles for this route:", requiredRoles);
    console.log("Is role matched?:", requiredRoles.includes(role));

    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new Error(
        "You are forbidden.You are not eligible to access this routes",
      );
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    req.user = {
      id,

      role,
      email,
    };

    next();
  });
};
