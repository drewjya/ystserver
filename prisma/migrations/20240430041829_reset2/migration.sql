/*
  Warnings:

  - Added the required column `alamat` to the `Cabang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cabang" ADD COLUMN     "alamat" TEXT NOT NULL;
