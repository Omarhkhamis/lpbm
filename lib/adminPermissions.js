import { normalizeSite } from "./sites";

export const ADMIN_ROLE = {
  ADMIN: "admin",
  DATA_VIEWER: "data_viewer"
};

export const DATA_LOCALE_ACCESS = {
  ALL: "all",
  EN: "en",
  RU: "ru"
};

export const normalizeAdminRole = (role) =>
  String(role || "").toLowerCase() === ADMIN_ROLE.DATA_VIEWER
    ? ADMIN_ROLE.DATA_VIEWER
    : ADMIN_ROLE.ADMIN;

export const normalizeDataLocaleAccess = (value) => {
  const normalized = String(value || "").toLowerCase();
  return Object.values(DATA_LOCALE_ACCESS).includes(normalized)
    ? normalized
    : DATA_LOCALE_ACCESS.ALL;
};

export const isDataViewer = (user) =>
  normalizeAdminRole(user?.role) === ADMIN_ROLE.DATA_VIEWER;

export const isFullAdmin = (user) => Boolean(user) && !isDataViewer(user);

export const getDataViewerLanguage = (user) => {
  if (!isDataViewer(user)) return "";
  const access = normalizeDataLocaleAccess(user?.dataLocaleAccess);
  return access === DATA_LOCALE_ACCESS.ALL ? "" : access;
};

export const resolveDataLanguageFilter = (user, requestedLanguage) => {
  const requested = normalizeDataLocaleAccess(requestedLanguage);
  if (!isDataViewer(user)) {
    return requested === DATA_LOCALE_ACCESS.ALL ? "" : requested;
  }

  const allowed = normalizeDataLocaleAccess(user?.dataLocaleAccess);
  if (allowed === DATA_LOCALE_ACCESS.ALL) {
    return requested === DATA_LOCALE_ACCESS.ALL ? "" : requested;
  }
  return allowed;
};

export const getDataHomePath = (
  user,
  site = "hollywood-smile",
  { scoped = false } = {}
) => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const params = new URLSearchParams();
  if (!scoped) params.set("site", siteId);

  const language = getDataViewerLanguage(user);
  if (language) params.set("language", language);

  const query = params.toString();
  const path = scoped ? `/${siteId}/admin90/form-data` : "/admin90/form-data";
  return query ? `${path}?${query}` : path;
};
