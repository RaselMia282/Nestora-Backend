import { z } from "zod";

export const createPropertySchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  title: z.string().min(3, "Property title must be at least 3 characters"),
  description: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
});

const propertySortEnum = z.enum(["latest", "oldest"]);

export const getAllPropertiesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(12),

  search: z.string().optional(),

  categoryId: z.string().uuid("Invalid category ID").optional(),

  city: z.string().optional(),
  address: z.string().optional(),
  

  sort: propertySortEnum.optional().default("latest"),
});


export const updatePropertySchema = z.object({
  categoryId: z.string().uuid("Invalid category ID").optional(),

  title: z
    .string()
    .min(3, "Property title must be at least 3 characters")
    .optional(),

  description: z.string().optional(),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .optional(),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .optional(),
});
