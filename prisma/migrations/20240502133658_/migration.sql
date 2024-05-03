/*
  Warnings:

  - A unique constraint covering the columns `[categoryId,nama]` on the table `Treatment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Treatment_categoryId_nama_key" ON "Treatment"("categoryId", "nama");
