-- Rename case study pillar labels to match client taxonomy.
UPDATE "CaseStudy"
SET "pillar" = CASE
  WHEN "pillar" = 'Content' THEN 'Brand Partnership'
  WHEN "pillar" = 'Brand' THEN 'Ambassador'
  WHEN "pillar" = 'Live' THEN 'Live Event'
  ELSE "pillar"
END;

ALTER TABLE "CaseStudy"
ALTER COLUMN "pillar" SET DEFAULT 'Brand Partnership';
