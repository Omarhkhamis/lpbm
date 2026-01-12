import { prisma } from "./prisma";
import { normalizeLocale, normalizeSite } from "./sites";

export const ensureSeoSettings = async (site = "hollywood-smile", locale = "en") => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const lang = normalizeLocale(locale);
  return prisma.seoSettings.upsert({
    where: { site_locale: { site: siteId, locale: lang } },
    update: {},
    create: {
      site: siteId,
      locale: lang,
      metaTitle: "",
      metaDescription: "",
      metaKeywords: null,
      metaImage: null
    }
  });
};

export const getSeoSettings = async (site = "hollywood-smile", locale = "en") => {
  const settings = await ensureSeoSettings(site, locale);
  return settings;
};
