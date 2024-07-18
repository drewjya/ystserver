/*
  Warnings:

  - You are about to drop the `_TagsToTreatment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TagsToTreatment" DROP CONSTRAINT "_TagsToTreatment_A_fkey";

-- DropForeignKey
ALTER TABLE "_TagsToTreatment" DROP CONSTRAINT "_TagsToTreatment_B_fkey";

-- AlterTable
ALTER TABLE "Treatment" ADD COLUMN     "tagsId" INTEGER;

-- DropTable
DROP TABLE "_TagsToTreatment";

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "Tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;
