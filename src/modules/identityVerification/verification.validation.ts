import { z } from "zod";

export const createIdentityVerificationSchema = z.object({
  nidNumber: z
    .string()
    .min(10, "NID number must be at least 10 characters")
    .max(20, "NID number must not exceed 20 characters"),
});