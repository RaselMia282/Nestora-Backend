/*
  Warnings:

  - A unique constraint covering the columns `[leaseId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payments_leaseId_key" ON "payments"("leaseId");
