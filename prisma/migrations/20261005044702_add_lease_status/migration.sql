-- CreateEnum
CREATE TYPE "LeaseStatus" AS ENUM ('ACTIVE', 'TERMINATED');

-- AlterTable
ALTER TABLE "leases" ADD COLUMN     "status" "LeaseStatus" NOT NULL DEFAULT 'ACTIVE';
