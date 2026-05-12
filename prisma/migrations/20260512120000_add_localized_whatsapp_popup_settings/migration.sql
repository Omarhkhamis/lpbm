ALTER TABLE "GeneralSettings"
ADD COLUMN IF NOT EXISTS "whatsappLinkEn" TEXT,
ADD COLUMN IF NOT EXISTS "whatsappLinkRu" TEXT,
ADD COLUMN IF NOT EXISTS "popupFormTitleEn" TEXT,
ADD COLUMN IF NOT EXISTS "popupFormTitleRu" TEXT,
ADD COLUMN IF NOT EXISTS "popupFormBodyEn" TEXT,
ADD COLUMN IF NOT EXISTS "popupFormBodyRu" TEXT,
ADD COLUMN IF NOT EXISTS "popupWhatsappMessageEn" TEXT,
ADD COLUMN IF NOT EXISTS "popupWhatsappMessageRu" TEXT;

UPDATE "GeneralSettings"
SET
  "whatsappLinkEn" = COALESCE("whatsappLinkEn", "whatsappLink"),
  "whatsappLinkRu" = COALESCE("whatsappLinkRu", "whatsappLink"),
  "popupFormTitleEn" = COALESCE("popupFormTitleEn", "popupFormTitle"),
  "popupFormBodyEn" = COALESCE("popupFormBodyEn", "popupFormBody"),
  "popupWhatsappMessageEn" = COALESCE(
    "popupWhatsappMessageEn",
    "popupWhatsappMessage"
  );
