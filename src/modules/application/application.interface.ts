import { ApplicationStatus } from "../../generated/prisma/enums";

export interface ICreateApplication {
  listingId: string;
}


export interface IUpdateApplication {
  status: ApplicationStatus;
}


export interface IUpdateApplicationByOwner {
  status: "APPROVED" | "REJECTED";
}