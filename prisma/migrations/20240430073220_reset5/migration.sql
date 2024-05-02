/*
  Warnings:

  - Added the required column `updatedAt` to the `TherapistTreatment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "HappyHour" DROP CONSTRAINT "HappyHour_cabangId_fkey";

-- AlterTable
ALTER TABLE "Cabang" ADD COLUMN     "happyHourId" INTEGER;

-- AlterTable
ALTER TABLE "TherapistTreatment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Cabang" ADD CONSTRAINT "Cabang_happyHourId_fkey" FOREIGN KEY ("happyHourId") REFERENCES "HappyHour"("id") ON DELETE SET NULL ON UPDATE CASCADE;
