-- AlterTable
ALTER TABLE "Expert" ADD COLUMN "airtableId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Expert_airtableId_key" ON "Expert"("airtableId");
