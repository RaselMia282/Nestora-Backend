import { VerificationStatus } from "../../generated/prisma/enums";

export interface ICreateIdentityVerification {
  nidNumber: string;
  // nidFont:Express.Multer.File;
  // nidBack:Express.Multer.File;
}


export interface IUpdateVerificationStatusPayload {
  status: VerificationStatus;
}