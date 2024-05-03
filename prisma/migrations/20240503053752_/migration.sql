/*
  Warnings:

  - You are about to drop the `HappyHourTreatment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HappyHourTreatment" DROP CONSTRAINT "HappyHourTreatment_cabangId_fkey";

-- DropForeignKey
ALTER TABLE "HappyHourTreatment" DROP CONSTRAINT "HappyHourTreatment_treatmentId_fkey";

-- DropTable
DROP TABLE "HappyHourTreatment";
