ALTER TABLE "CustomHeader"
ADD COLUMN "contentEn" TEXT,
ADD COLUMN "contentRu" TEXT;

UPDATE "CustomHeader"
SET
  "contentEn" = COALESCE("contentEn", "content"),
  "contentRu" = COALESCE("contentRu", "content");
