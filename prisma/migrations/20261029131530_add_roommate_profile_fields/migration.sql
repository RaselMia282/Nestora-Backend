/*
  Warnings:

  - Added the required column `profileImg` to the `roommate_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileImgPublicId` to the `roommate_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roommate_profiles" ADD COLUMN     "profileImg" TEXT NOT NULL,
ADD COLUMN     "profileImgPublicId" TEXT NOT NULL;
