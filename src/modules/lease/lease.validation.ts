import { z } from "zod";

export const createLeaseSchema = z
  .object({
    applicationId: z.string().uuid("Invalid application ID"),

    startDate: z.string().datetime("Invalid start date"),

    endDate: z.string().datetime("Invalid end date"),

    monthlyRent: z.number().positive("Monthly rent must be greater than 0"),

    securityDeposit: z
      .number()
      .nonnegative("Security deposit cannot be negative"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const updateLeaseSchema = z.object({
  startDate: z.string().datetime("Invalid start date").optional(),

  endDate: z.string().datetime("Invalid end date").optional(),

  monthlyRent: z
    .number()
    .positive("Monthly rent must be greater than 0")
    .optional(),

  securityDeposit: z
    .number()
    .nonnegative("Security deposit cannot be negative")
    .optional(),
});
