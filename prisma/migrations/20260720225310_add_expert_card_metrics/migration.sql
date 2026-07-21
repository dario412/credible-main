-- AlterTable
ALTER TABLE "Expert" ADD COLUMN     "audienceWhere" TEXT,
ADD COLUMN     "audienceWho" TEXT,
ADD COLUMN     "channels" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "combinedReach" TEXT,
ADD COLUMN     "growth90d" TEXT;
