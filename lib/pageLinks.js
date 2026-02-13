export const buildPrivacyPolicyLink = (pathname = "") => {
  const normalized = String(pathname || "").toLowerCase();
  const params = new URLSearchParams();

  if (normalized.includes("/ru")) {
    params.set("locale", "ru");
  } else if (normalized.includes("/en")) {
    params.set("locale", "en");
  }

  if (normalized.startsWith("/dental-implant")) {
    params.set("site", "dental-implant");
  } else if (normalized.startsWith("/hollywood-smile")) {
    params.set("site", "hollywood-smile");
  }

  const query = params.toString();
  return query ? `/privacy-policy?${query}` : "/privacy-policy";
};

export const getPrivacyConsentText = (pathname = "") => {
  const normalized = String(pathname || "").toLowerCase();
  if (normalized.includes("/ru")) {
    return "Отправляя форму, вы соглашаетесь с Политикой конфиденциальности";
  }
  if (normalized.includes("/en")) {
    return "By submitting the form, you agree to the Privacy Policy";
  }
  return "By submitting the form, you agree to the Privacy Policy";
};
