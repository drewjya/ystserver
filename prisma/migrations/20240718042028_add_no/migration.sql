/*
  Warnings:

  - Added the required column `no` to the `Therapist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_therapistId_fkey";

-- DropForeignKey
ALTER TABLE "TherapistSkillTag" DROP CONSTRAINT "TherapistSkillTag_tagsId_fkey";

-- DropForeignKey
ALTER TABLE "TherapistSkillTag" DROP CONSTRAINT "TherapistSkillTag_therapistId_fkey";

-- DropForeignKey
ALTER TABLE "TreatmentCabang" DROP CONSTRAINT "TreatmentCabang_cabangId_fkey";

-- DropForeignKey
ALTER TABLE "TreatmentCabang" DROP CONSTRAINT "TreatmentCabang_treatmentId_fkey";

-- AlterTable
ALTER TABLE "Therapist" ADD COLUMN     "no" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TreatmentCabang" ADD CONSTRAINT "TreatmentCabang_cabangId_fkey" FOREIGN KEY ("cabangId") REFERENCES "Cabang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentCabang" ADD CONSTRAINT "TreatmentCabang_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistSkillTag" ADD CONSTRAINT "TherapistSkillTag_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistSkillTag" ADD CONSTRAINT "TherapistSkillTag_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "Therapist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "Therapist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
