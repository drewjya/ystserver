/*
  Warnings:

  - Added the required column `nama` to the `Treatment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_pictureId_fkey";

-- AlterTable
ALTER TABLE "Attendace" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "checkIn" DROP NOT NULL,
ALTER COLUMN "checkOut" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HappyHour" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "deletedAt" DROP NOT NULL,
ALTER COLUMN "pictureId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Picture" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Therapist" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Treatment" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "nama" TEXT NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "Picture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
