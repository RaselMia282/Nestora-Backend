import { z } from "zod";

export const createApplicationSchema = z.object({
  listingId: z.string().uuid("Invalid listing ID"),
});