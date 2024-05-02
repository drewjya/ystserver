/*
  Warnings:

  - A unique constraint covering the columns `[nama]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_nama_key" ON "Category"("nama");
