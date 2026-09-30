
import { z } from "zod";

export const createRoomSchema = z.object({
  propertyId: z.string().uuid("Invalid property ID"),

  roomNumber: z
    .string()
    .min(1, "Room number is required"),

      roomType: z.enum(["SINGLE", "DOUBLE", "MASTER", "SHARED"]),

  baseRent: z.coerce
    .number()
    .positive("Base rent must be greater than 0"),
});