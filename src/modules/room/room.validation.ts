import { z } from "zod";
import { RoomStatus } from "../../generated/prisma/enums";

export const createRoomSchema = z.object({
  propertyId: z.string().uuid("Invalid property ID"),

  roomNumber: z.string().min(1, "Room number is required"),

  roomType: z.enum(["SINGLE", "DOUBLE", "MASTER", "SHARED"]),

  baseRent: z.coerce.number().positive("Base rent must be greater than 0"),
});

export const updateRoomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required").optional(),

  roomType: z.enum(["SINGLE", "DOUBLE", "MASTER", "SHARED"]).optional(),

  baseRent: z.coerce
    .number()
    .positive("Base rent must be greater than 0")
    .optional(),

  status: z.enum(RoomStatus).optional(),
});
