-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "propertyId" TEXT;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
