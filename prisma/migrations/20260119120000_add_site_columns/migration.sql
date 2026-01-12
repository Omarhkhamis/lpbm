
-- Drop old composite unique on (key, locale) if it exists
ALTER TABLE "Section" DROP CONSTRAINT IF EXISTS "Section_key_locale_key";
DROP INDEX IF EXISTS "Section_key_locale_key";

-- CustomHeader site column and unique constraint
ALTER TABLE "CustomHeader" ADD COLUMN IF NOT EXISTS "site" TEXT NOT NULL DEFAULT 'hollywood-smile';
CREATE UNIQUE INDEX IF NOT EXISTS "CustomHeader_site_key" ON "CustomHeader"("site");

-- GeneralSettings site column and unique constraint
ALTER TABLE "GeneralSettings" ADD COLUMN IF NOT EXISTS "site" TEXT NOT NULL DEFAULT 'hollywood-smile';
CREATE UNIQUE INDEX IF NOT EXISTS "GeneralSettings_site_key" ON "GeneralSettings"("site");

-- Section site column and unique constraint across key/locale/site
ALTER TABLE "Section" ADD COLUMN IF NOT EXISTS "site" TEXT NOT NULL DEFAULT 'hollywood-smile';
CREATE UNIQUE INDEX IF NOT EXISTS "Section_key_locale_site_key" ON "Section"("key", "locale", "site");

-- SeoSettings site/locale columns and unique constraint
ALTER TABLE "SeoSettings" ADD COLUMN IF NOT EXISTS "locale" TEXT NOT NULL DEFAULT 'en';
ALTER TABLE "SeoSettings" ADD COLUMN IF NOT EXISTS "site" TEXT NOT NULL DEFAULT 'hollywood-smile';
CREATE UNIQUE INDEX IF NOT EXISTS "SeoSettings_site_locale_key" ON "SeoSettings"("site", "locale");

-- Optional site columns for related tables
ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "site" TEXT;
ALTER TABLE "SpinData" ADD COLUMN IF NOT EXISTS "site" TEXT;
