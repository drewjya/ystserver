/*
  Warnings:

  - A unique constraint covering the columns `[nama]` on the table `Cabang` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cabang_nama_key" ON "Cabang"("nama");
