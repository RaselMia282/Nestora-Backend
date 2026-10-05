/*
  Warnings:

  - The `paymentMethod` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'SSLCOMMERZ', 'BKASH', 'CASH_ON_DELIVERY', 'STRIPE');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "paymentData" JSONB,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod";
