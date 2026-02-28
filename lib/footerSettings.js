import { prisma } from "./prisma";
import { getDefaultFooterSettings } from "./footerDefaults";
import { normalizeLocale, normalizeSite } from "./sites";

export const ensureFooterSettings = async (site = "hollywood-smile", locale = "en") => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const lang = normalizeLocale(locale);
  const existing = await prisma.footerSettings.findUnique({
    where: { site_locale: { site: siteId, locale: lang } }
  });
  if (existing) return existing;

  const defaults = getDefaultFooterSettings(siteId, lang);
  try {
    return await prisma.footerSettings.create({
      data: {
        site: siteId,
        locale: lang,
        data: defaults
      }
    });
  } catch (error) {
    if (error?.code === "P2002") {
      return prisma.footerSettings.findUnique({
        where: { site_locale: { site: siteId, locale: lang } }
      });
    }
    throw error;
  }
};

export const getFooterSettings = async (site = "hollywood-smile", locale = "en") => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const lang = normalizeLocale(locale);
  const settings = await ensureFooterSettings(siteId, lang);
  return {
    ...getDefaultFooterSettings(siteId, lang),
    ...(settings?.data || {})
  };
};

