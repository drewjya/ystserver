-- CreateTable
CREATE TABLE "TherapistSkillTag" (
    "tagsId" INTEGER NOT NULL,
    "therapistId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TherapistSkillTag_pkey" PRIMARY KEY ("therapistId","tagsId")
);

-- AddForeignKey
ALTER TABLE "TherapistSkillTag" ADD CONSTRAINT "TherapistSkillTag_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistSkillTag" ADD CONSTRAINT "TherapistSkillTag_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "Therapist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
