import { RoomType } from "../../generated/prisma/enums";

export interface ICreateRoom {
  propertyId: string;
  roomNumber: string;
  roomType: RoomType;
  baseRent: number;
}