import { prisma } from "./prisma";
import { getSectionDefaults } from "./sectionDefaults";
import { normalizeLocale, normalizeSite } from "./sites";

export const SITE_SECTION_DEFINITIONS = {
  "hollywood-smile": [
    { key: "hero", label: "Hero" },
    { key: "hollywoodSmile", label: "Hollywood Smile" },
    { key: "popularTreatments", label: "Popular Treatments" },
    { key: "bookAppointmentPrimary", label: "Book Appointment (Top)" },
    { key: "beforeAfter", label: "Before & After" },
    { key: "certificatesGallery", label: "Certificates Gallery" },
    { key: "fullWidthCampaign", label: "Campaign Banner" },
    { key: "stepForm", label: "Step Form" },
    { key: "treatments", label: "Treatments" },
    { key: "bookAppointmentSecondary", label: "Book Appointment (Bottom)" },
    { key: "internationalPatients", label: "International Patients" },
    { key: "teamMembers", label: "Team Members" },
    { key: "clinic", label: "Clinic" },
    { key: "healthTourism", label: "Health Tourism" },
    { key: "luckySpin", label: "Lucky Spin" },
    { key: "localAttractions", label: "Local Attractions" },
    { key: "googleReviews", label: "Google Reviews" },
    { key: "trustpilotReviews", label: "Trustpilot Reviews" },
    { key: "faqs", label: "FAQs" }
  ],
  "dental-implant": [
    { key: "hero", label: "Hero" },
    { key: "dentalImplant", label: "Dental Implants" },
    { key: "popularTreatments", label: "Popular Treatments" },
    { key: "bookAppointmentPrimary", label: "Book Appointment (Top)" },
    { key: "beforeAfter", label: "Before & After" },
    { key: "certificatesGallery", label: "Certificates Gallery" },
    { key: "fullWidthCampaign", label: "Campaign Banner" },
    { key: "stepForm", label: "Step Form" },
    { key: "treatments", label: "Treatments" },
    { key: "bookAppointmentSecondary", label: "Book Appointment (Bottom)" },
    { key: "internationalPatients", label: "International Patients" },
    { key: "teamMembers", label: "Team Members" },
    { key: "clinic", label: "Clinic" },
    { key: "healthTourism", label: "Health Tourism" },
    { key: "luckySpin", label: "Lucky Spin" },
    { key: "localAttractions", label: "Local Attractions" },
    { key: "implantMatrix", label: "Implant Matrix" },
    { key: "techniquesUsed", label: "Techniques Used" },
    { key: "googleReviews", label: "Google Reviews" },
    { key: "trustpilotReviews", label: "Trustpilot Reviews" },
    { key: "faqs", label: "FAQs" }
  ]
};

const mergeSectionData = (defaults, current) => {
  if (current === null || typeof current === "undefined") return defaults;
  if (Array.isArray(defaults)) {
    return Array.isArray(current) ? current : defaults;
  }
  if (defaults && typeof defaults === "object") {
    const merged = { ...defaults };
    if (current && typeof current === "object") {
      for (const [key, value] of Object.entries(current)) {
        merged[key] = mergeSectionData(defaults[key], value);
      }
    }
    return merged;
  }
  return current;
};

const ensureLocaleSections = async (site, locale) => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const lang = normalizeLocale(locale);
  const definitions = SITE_SECTION_DEFINITIONS[siteId] || [];
  const orderMap = new Map(definitions.map((section, index) => [section.key, index]));

  const existing = await prisma.section.findMany({
    where: { site: siteId, locale: lang },
    select: { key: true, sortOrder: true, label: true, data: true }
  });
  const existingMap = new Map(existing.map((item) => [item.key, item]));

  for (const def of definitions) {
    const found = existingMap.get(def.key);
    if (!found) {
      try {
        await prisma.section.create({
          data: {
            key: def.key,
            label: def.label,
            enabled: true,
            locale: lang,
            site: siteId,
            sortOrder: orderMap.get(def.key) ?? 0,
            data: getSectionDefaults(def.key, lang, siteId)
          }
        });
      } catch (error) {
        // Ignore unique constraint races when parallel requests create the same section
        if (!(error && error.code === "P2002")) {
          throw error;
        }
      }
      continue;
    }
    const updateData = {};
    if (found.sortOrder === null || typeof found.sortOrder === "undefined") {
      updateData.sortOrder = orderMap.get(def.key) ?? 0;
    }
    if (found.label !== def.label) {
      updateData.label = def.label;
    }
    if (def.key === "certificatesGallery" && found.data && typeof found.data === "object") {
      const currentTitle = String(found.data.title || "");
      const currentKicker = String(found.data.kicker || "");
      const currentDescription = String(found.data.description || "");
      const hasArabicLegacy =
        currentTitle === "معرض الشهادات" ||
        currentKicker === "الشهادات" ||
        currentDescription.includes("الشهادات");
      if (hasArabicLegacy) {
        updateData.data = {
          ...found.data,
          kicker: lang === "ru" ? "Сертификаты" : "Certificates",
          title: lang === "ru" ? "Галерея сертификатов" : "Certificates Gallery",
          description:
            lang === "ru"
              ? "Официальные сертификаты и подтверждения, отражающие наши стандарты качества."
              : "Official certificates and recognitions that reflect our quality standards."
        };
      }
    }
    if (Object.keys(updateData).length) {
      await prisma.section.update({
        where: { key_locale_site: { key: def.key, locale: lang, site: siteId } },
        data: updateData
      });
    }
  }
};

export const ensureSections = async (site = "hollywood-smile", locale = "en") => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const lang = normalizeLocale(locale);
  const localesToEnsure = new Set([lang, "ru"]);
  for (const loc of localesToEnsure) {
    await ensureLocaleSections(siteId, loc);
  }
};

export const getSections = async (site = "hollywood-smile") => {
  return getSectionsByLocale(site, "en");
};

export const getSectionsByLocale = async (
  site = "hollywood-smile",
  locale = "en"
) => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const lang = normalizeLocale(locale);
  await ensureSections(siteId, lang);
  const sections = await prisma.section.findMany({
    where: { site: siteId, locale: lang }
  });
  const orderMap = new Map(
    (SITE_SECTION_DEFINITIONS[siteId] || []).map((section, index) => [
      section.key,
      index
    ])
  );
  return sections.sort((a, b) => {
    const aOrder =
      typeof a.sortOrder === "number" ? a.sortOrder : orderMap.get(a.key) ?? 0;
    const bOrder =
      typeof b.sortOrder === "number" ? b.sortOrder : orderMap.get(b.key) ?? 0;
    return aOrder - bOrder;
  });
};

export const getSectionByKey = async (
  key,
  site = "hollywood-smile",
  locale = "en"
) => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const lang = normalizeLocale(locale);
  await ensureSections(siteId, lang);
  return prisma.section.findUnique({
    where: { key_locale_site: { key, locale: lang, site: siteId } }
  });
};

export const getSectionsMap = async (
  site = "hollywood-smile",
  locale = "en"
) => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const lang = normalizeLocale(locale);
  await ensureSections(siteId, lang);
  const sections = await prisma.section.findMany({
    where: { site: siteId, locale: lang }
  });
  const map = {};

  for (const section of sections) {
    const defaults = getSectionDefaults(section.key, lang, siteId);
    map[section.key] = {
      ...section,
      data: mergeSectionData(defaults, section.data)
    };
  }

  return map;
};
