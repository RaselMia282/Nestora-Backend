import { RoomStatus, RoomType } from "../../generated/prisma/enums";

export interface ICreateRoom {
  propertyId: string;
  roomNumber: string;
  roomType: RoomType;
  baseRent: number;
}


export interface IUpdateRoom {
  roomNumber?: string;
  roomType?: RoomType;
  baseRent?: number;
  status?: RoomStatus ;
}