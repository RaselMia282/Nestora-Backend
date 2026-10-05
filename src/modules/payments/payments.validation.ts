import { z } from "zod";

export const createPaymentSchema = z.object({
  leaseId: z.string().uuid("Invalid lease ID"),
});