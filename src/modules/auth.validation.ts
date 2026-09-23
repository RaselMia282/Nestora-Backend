import { z } from "zod";
import { Gender, Role } from "../generated/prisma/enums";

export const registerUserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "password atleast must be 6 characters or long"),
  phone: z.string().optional(),
  gender: z.enum(Gender).optional(),
  role: z
    .enum([Role.TENANT, Role.ADMIN, Role.MANAGER, Role.OWNER])
    .default(Role.TENANT),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "password atleast must be 6 characters or long"),
});


export const googleLoginSchema = z.object({
  idToken: z.string().min(1),
  required_error: "Google ID Token is required",
});
