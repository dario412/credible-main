-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "headingFamily" TEXT NOT NULL DEFAULT 'Faculty Glyphic',
    "headingSource" TEXT NOT NULL DEFAULT 'default',
    "headingAssetId" TEXT,
    "bodyFamily" TEXT NOT NULL DEFAULT 'Instrument Sans',
    "bodySource" TEXT NOT NULL DEFAULT 'default',
    "bodyAssetId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FontAsset" (
    "id" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FontAsset_pkey" PRIMARY KEY ("id")
);

-- Seed default settings row
INSERT INTO "SiteSettings" ("id", "headingFamily", "headingSource", "bodyFamily", "bodySource", "updatedAt")
VALUES ('default', 'Faculty Glyphic', 'default', 'Instrument Sans', 'default', CURRENT_TIMESTAMP);
