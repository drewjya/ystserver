/*
  Warnings:

  - You are about to drop the column `endDay` on the `HappyHour` table. All the data in the column will be lost.
  - You are about to drop the column `endHour` on the `HappyHour` table. All the data in the column will be lost.
  - You are about to drop the column `startDay` on the `HappyHour` table. All the data in the column will be lost.
  - You are about to drop the column `startHour` on the `HappyHour` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HappyHour" DROP COLUMN "endDay",
DROP COLUMN "endHour",
DROP COLUMN "startDay",
DROP COLUMN "startHour",
ADD COLUMN     "publicHoliday" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "HappyHourDetail" (
    "id" SERIAL NOT NULL,
    "startDay" INTEGER NOT NULL,
    "endDay" INTEGER NOT NULL,
    "startHour" TEXT NOT NULL,
    "endHour" TEXT NOT NULL,
    "happyHourId" INTEGER,

    CONSTRAINT "HappyHourDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HappyHourDetail" ADD CONSTRAINT "HappyHourDetail_happyHourId_fkey" FOREIGN KEY ("happyHourId") REFERENCES "HappyHour"("id") ON DELETE SET NULL ON UPDATE CASCADE;
