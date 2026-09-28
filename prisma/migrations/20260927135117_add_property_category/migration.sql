-- AlterTable
ALTER TABLE "property_categories" ADD COLUMN     "categoryImg" TEXT,
ADD COLUMN     "categoryImgPublicId" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;
