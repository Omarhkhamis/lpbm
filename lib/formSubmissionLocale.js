export const FORM_SUBMISSION_LOCALES = ["en", "ru"];

export const normalizeSubmissionLocale = (value) => {
  const normalized = String(value || "").toLowerCase();
  return FORM_SUBMISSION_LOCALES.includes(normalized) ? normalized : "";
};

export const getSubmissionLocale = (recordOrPayload) => {
  const directLocale = normalizeSubmissionLocale(recordOrPayload?.locale);
  if (directLocale) return directLocale;

  const payload =
    recordOrPayload?.payload &&
    typeof recordOrPayload.payload === "object" &&
    !Array.isArray(recordOrPayload.payload)
      ? recordOrPayload.payload
      : recordOrPayload || {};
  const explicitLocale = normalizeSubmissionLocale(payload.locale);
  if (explicitLocale) return explicitLocale;

  const page = String(recordOrPayload?.page || payload.page || "").toLowerCase();
  if (page.includes("/ru")) return "ru";
  if (page.includes("/en")) return "en";

  return "en";
};

export const getSubmissionLocaleLabel = (locale) =>
  normalizeSubmissionLocale(locale) === "ru" ? "Russian" : "English";

export const filterSubmissionsByLocale = (records, locale) => {
  const normalized = normalizeSubmissionLocale(locale);
  if (!normalized) return records;
  return records.filter((record) => getSubmissionLocale(record) === normalized);
};
