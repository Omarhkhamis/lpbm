CREATE TABLE "FooterSettings" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL DEFAULT 'hollywood-smile',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FooterSettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FooterSettings_site_locale_key" ON "FooterSettings"("site", "locale");
