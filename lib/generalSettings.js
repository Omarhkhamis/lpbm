import { prisma } from "./prisma";
import {
  DEFAULT_POPUP_FORM_SETTINGS,
  getDefaultPopupFormSettings
} from "./popupFormDefaults";
import { normalizeLocale, normalizeSite } from "./sites";

const DEFAULT_WHATSAPP_LINK = "https://wa.me/+905382112583";
const POPUP_FIELDS = [
  "popupFormTitle",
  "popupFormBody",
  "popupWhatsappMessage"
];
const localeSuffix = (locale) =>
  normalizeLocale(locale) === "ru" ? "Ru" : "En";
const localizedField = (field, locale) => `${field}${localeSuffix(locale)}`;

export const DEFAULT_GENERAL_SETTINGS = {
  phone: "+90 538 211 25 83",
  email: "info@bmturkiye.com",
  formRecipientEmail: null,
  address: "Talatpaşa Cd No:33/A, 34180 Bahçelievler/İstanbul, Turkey",
  whatsappNumber: "+905382112583",
  whatsappLink: DEFAULT_WHATSAPP_LINK,
  whatsappLinkEn: DEFAULT_WHATSAPP_LINK,
  whatsappLinkRu: DEFAULT_WHATSAPP_LINK,
  ...DEFAULT_POPUP_FORM_SETTINGS,
  popupFormTitleEn: getDefaultPopupFormSettings("en").popupFormTitle,
  popupFormTitleRu: getDefaultPopupFormSettings("ru").popupFormTitle,
  popupFormBodyEn: getDefaultPopupFormSettings("en").popupFormBody,
  popupFormBodyRu: getDefaultPopupFormSettings("ru").popupFormBody,
  popupWhatsappMessageEn:
    getDefaultPopupFormSettings("en").popupWhatsappMessage,
  popupWhatsappMessageRu:
    getDefaultPopupFormSettings("ru").popupWhatsappMessage,
  hideFormPrivacyNote: false,
  consultationDelaySeconds: 10,
  logoUrl: "/uploads/bm-logo-brown.svg",
  faviconUrl: "/uploads/favicon.ico",
  social: {
    instagram: "",
    facebook: "",
    youtube: ""
  }
};

export const ensureGeneralSettings = async (site = "hollywood-smile") => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const existing = await prisma.generalSettings.findUnique({
    where: { site: siteId }
  });
  if (existing) return existing;

  try {
    return await prisma.generalSettings.create({
      data: {
        site: siteId,
        ...DEFAULT_GENERAL_SETTINGS
      }
    });
  } catch (error) {
    // Handle race conditions across multiple processes on first boot
    if (error?.code === "P2002") {
      return prisma.generalSettings.findUnique({ where: { site: siteId } });
    }
    throw error;
  }
};

export const getGeneralSettings = async (site = "hollywood-smile") => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const settings = await ensureGeneralSettings(siteId);
  return {
    ...DEFAULT_GENERAL_SETTINGS,
    ...settings,
    consultationDelaySeconds:
      settings.consultationDelaySeconds ??
      DEFAULT_GENERAL_SETTINGS.consultationDelaySeconds,
    social: {
      ...DEFAULT_GENERAL_SETTINGS.social,
      ...(settings.social || {})
    }
  };
};

export const getLocalizedPopupFormSettings = (settings, locale = "en") => {
  const lang = normalizeLocale(locale);
  const defaults = getDefaultPopupFormSettings(lang);
  const source = settings || {};

  return POPUP_FIELDS.reduce((values, field) => {
    const localizedValue = source[localizedField(field, lang)];
    const legacyValue = lang === "en" ? source[field] : "";
    values[field] = localizedValue || legacyValue || defaults[field];
    return values;
  }, {});
};

export const getLocalizedWhatsappLink = (settings, locale = "en") => {
  const source = settings || {};
  const localizedValue = source[localizedField("whatsappLink", locale)];
  return localizedValue || source.whatsappLink || null;
};

export const getLocalizedGeneralSettings = (settings, locale = "en") => ({
  ...DEFAULT_GENERAL_SETTINGS,
  ...(settings || {}),
  whatsappLink: getLocalizedWhatsappLink(settings, locale),
  ...getLocalizedPopupFormSettings(settings, locale)
});
