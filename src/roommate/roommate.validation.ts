import z from "zod";

export const createRoommateProfileSchema = z.object({
  gender: z.string(),
  budget: z.coerce.number().positive(),
  lifestyle: z.array(z.string()),
  occupation: z.string().optional(),
  preferredArea: z.string().optional(),
  bio: z.string().optional(),
  profileImg: z.string().url(),
  profileImgPublicId: z.string(),
});

export const updateRoommateProfileSchema = z
  .object({
    gender: z.string().min(1).optional(),
    occupation: z.string().optional(),
    budget: z.coerce.number().positive().optional(),
    preferredArea: z.string().optional(),
    lifestyle: z.array(z.string()).min(1).optional(),
    bio: z.string().max(1000).optional(),
  })
  .strict();
