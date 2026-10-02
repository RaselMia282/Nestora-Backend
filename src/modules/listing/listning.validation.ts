import { z } from "zod";

export const createListingSchema = z.object({
  roomId: z.string().uuid("Invalid room ID"),

  title: z.string().min(3, "Listing title must be at least 3 characters"),

  description: z.string().min(10, "Description must be at least 10 characters"),
});

export const updateListingSchema = z.object({
  title: z
    .string()
    .min(3, "Listing title must be at least 3 characters")
    .optional(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),

  isPublished: z.boolean().optional(),
});
