-- DropForeignKey
ALTER TABLE "Therapist" DROP CONSTRAINT "Therapist_cabangId_fkey";

-- AlterTable
ALTER TABLE "Therapist" ALTER COLUMN "cabangId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Therapist" ADD CONSTRAINT "Therapist_cabangId_fkey" FOREIGN KEY ("cabangId") REFERENCES "Cabang"("id") ON DELETE SET NULL ON UPDATE CASCADE;
