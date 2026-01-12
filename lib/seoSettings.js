import { prisma } from "./prisma";
import { normalizeLocale, normalizeSite } from "./sites";

export const ensureSeoSettings = async (site = "hollywood-smile", locale = "en") => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const lang = normalizeLocale(locale);
  const existing = await prisma.seoSettings.findUnique({
    where: { site_locale: { site: siteId, locale: lang } }
  });
  if (existing) return existing;

  try {
    return await prisma.seoSettings.create({
      data: {
        site: siteId,
        locale: lang,
        metaTitle: "",
        metaDescription: "",
        metaKeywords: null,
        metaImage: null
      }
    });
  } catch (error) {
    if (error?.code === "P2002") {
      return prisma.seoSettings.findUnique({
        where: { site_locale: { site: siteId, locale: lang } }
      });
    }
    throw error;
  }
};

export const getSeoSettings = async (site = "hollywood-smile", locale = "en") => {
  const settings = await ensureSeoSettings(site, locale);
  return settings;
};
