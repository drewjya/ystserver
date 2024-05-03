/*
  Warnings:

  - A unique constraint covering the columns `[gender,nama,deletedAt]` on the table `Therapist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Banner" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "pictureId" INTEGER NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Therapist_gender_nama_deletedAt_key" ON "Therapist"("gender", "nama", "deletedAt");

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "Picture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
