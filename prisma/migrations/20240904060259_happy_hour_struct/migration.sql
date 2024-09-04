/*
  Warnings:

  - Made the column `happyHourId` on table `HappyHourDetail` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "HappyHourDetail" DROP CONSTRAINT "HappyHourDetail_happyHourId_fkey";

-- AlterTable
ALTER TABLE "HappyHourDetail" ALTER COLUMN "happyHourId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "HappyHourDetail" ADD CONSTRAINT "HappyHourDetail_happyHourId_fkey" FOREIGN KEY ("happyHourId") REFERENCES "HappyHour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
