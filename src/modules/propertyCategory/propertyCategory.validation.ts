import { z } from "zod";

export const createPropertyCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain lowercase letters, numbers and hyphens only",
    ),

  description: z.string().optional(),

  isActive: z.boolean().optional(),

  sortOrder: z.number().int().nonnegative().optional(),
});





export const updatePropertyCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .optional(),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain lowercase letters, numbers and hyphens only",
    )
    .optional(),

  description: z.string().optional(),

  isActive: z.boolean().optional(),

  sortOrder: z.number().int().nonnegative().optional(),
});