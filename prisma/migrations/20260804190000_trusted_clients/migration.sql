-- CreateTable
CREATE TABLE "TrustedClient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoSrc" TEXT NOT NULL DEFAULT '',
    "caseStudySlug" TEXT NOT NULL DEFAULT '',
    "testimonialQuote" TEXT,
    "testimonialName" TEXT,
    "testimonialTitle" TEXT,
    "testimonialImage" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrustedClient_pkey" PRIMARY KEY ("id")
);
