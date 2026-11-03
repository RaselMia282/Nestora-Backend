import z from "zod"


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