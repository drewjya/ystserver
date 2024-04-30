-- DropForeignKey
ALTER TABLE "Cabang" DROP CONSTRAINT "Cabang_pictureId_fkey";

-- AlterTable
ALTER TABLE "Cabang" ALTER COLUMN "pictureId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "gender" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Cabang" ADD CONSTRAINT "Cabang_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "Picture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
