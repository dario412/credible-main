-- AlterTable
ALTER TABLE "Expert" ADD COLUMN     "formats" TEXT[] DEFAULT ARRAY[]::TEXT[];
