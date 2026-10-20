import { z } from "zod";

export const createApplicationSchema = z.object({
  listingId: z.string().uuid("Invalid listing ID"),
  type: z.enum(["room", "property"]),
});



export const updateApplicationSchema = z.object({
  status: z.enum(["CANCELLED"]),
});


export const updateApplicationByOwnerSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});