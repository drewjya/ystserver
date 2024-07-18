-- DropForeignKey
ALTER TABLE "TherapistTreatment" DROP CONSTRAINT "TherapistTreatment_therapistId_fkey";

-- AddForeignKey
ALTER TABLE "TherapistTreatment" ADD CONSTRAINT "TherapistTreatment_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "Therapist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
