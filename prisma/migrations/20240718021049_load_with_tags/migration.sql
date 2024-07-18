/*
  Warnings:

  - Added the required column `tagsId` to the `Treatment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Treatment" ADD COLUMN     "tagsId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TagsToTreatment" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TagsToTreatment_AB_unique" ON "_TagsToTreatment"("A", "B");

-- CreateIndex
CREATE INDEX "_TagsToTreatment_B_index" ON "_TagsToTreatment"("B");

-- AddForeignKey
ALTER TABLE "_TagsToTreatment" ADD CONSTRAINT "_TagsToTreatment_A_fkey" FOREIGN KEY ("A") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagsToTreatment" ADD CONSTRAINT "_TagsToTreatment_B_fkey" FOREIGN KEY ("B") REFERENCES "Treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
