export interface CreateRoommatePayload {
  gender: string;
  occupation?: string;
  budget: number;
  preferredArea?: string;
  lifestyle: string[];
  bio?: string;
  profileImg: string;
  profileImgPublicId: string;
}