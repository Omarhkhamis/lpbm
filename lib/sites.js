export const SITES = [
  { id: "hollywood-smile", label: "Hollywood Smile" },
  { id: "dental-implant", label: "Dental Implant" }
];

export const SUPPORTED_LOCALES = ["en", "ru"];

export const normalizeSite = (site) => {
  const value = String(site || "").toLowerCase();
  return SITES.find((item) => item.id === value)?.id || null;
};

export const normalizeLocale = (locale) => {
  const value = String(locale || "").toLowerCase();
  return SUPPORTED_LOCALES.includes(value) ? value : SUPPORTED_LOCALES[0];
};
