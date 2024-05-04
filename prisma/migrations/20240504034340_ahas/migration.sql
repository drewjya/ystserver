/*
  Warnings:

  - Added the required column `durasi` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "durasi" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrderDetail" ADD COLUMN     "nama" TEXT NOT NULL;
