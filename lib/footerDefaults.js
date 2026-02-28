import { DEFAULT_GENERAL_SETTINGS } from "./generalSettings";
import { normalizeLocale, normalizeSite } from "./sites";

const BASE_DEFAULTS = {
  description:
    "At BM TURKIYE, we're dedicated to your dental well-being. Our experienced team, advanced technology, and personalized care ensure a healthy, confident smile. Let us redefine your dental experience. Contact us today for a brighter, healthier smile.",
  badge: "Advanced dentistry • Personalised care",
  note: "Comfortable experience, clear planning, and premium results.",
  navTreatments: "Treatments",
  navPopularTreatments: "Popular Treatments",
  navBeforeAfter: "Before & After",
  navTestimonials: "Testimonials",
  navFaqs: "FAQs",
  navHealthTourism: "Health Tourism",
  phoneLabel: "Phone",
  whatsappLabel: "WhatsApp",
  emailLabel: "E-mail",
  addressLabel: "Address",
  phone: DEFAULT_GENERAL_SETTINGS.phone,
  whatsappNumber: DEFAULT_GENERAL_SETTINGS.whatsappNumber,
  whatsappLink: "https://wa.me/+905382112583",
  email: DEFAULT_GENERAL_SETTINGS.email,
  address: DEFAULT_GENERAL_SETTINGS.address,
  footerLogoUrl: "",
  copyright: "© 2025 BM TURKIYE. All Rights Reserved.",
  privacy: "Privacy Policy",
  terms: "Terms",
  instagram: DEFAULT_GENERAL_SETTINGS.social?.instagram || "",
  facebook: DEFAULT_GENERAL_SETTINGS.social?.facebook || "",
  youtube: DEFAULT_GENERAL_SETTINGS.social?.youtube || ""
};

const RU_DEFAULTS = {
  description:
    "В BM TURKIYE мы заботимся о здоровье ваших зубов. Опытная команда, современные технологии и индивидуальный подход помогают сохранить здоровую и уверенную улыбку.",
  badge: "Современная стоматология • Индивидуальный подход",
  note: "Комфортный опыт, понятный план и премиальные результаты.",
  navTreatments: "Услуги",
  navPopularTreatments: "Популярное",
  navBeforeAfter: "До и После",
  navTestimonials: "Отзывы",
  navFaqs: "FAQ",
  navHealthTourism: "Медицинский туризм",
  phoneLabel: "Телефон",
  whatsappLabel: "WhatsApp",
  emailLabel: "мейл",
  addressLabel: "Адрес",
  copyright: "© 2025 BM TURKIYE. Все права защищены.",
  privacy: "Политика конфиденциальности",
  terms: "Условия"
};

const SITE_OVERRIDES = {
  "dental-implant": {
    en: {
      description:
        "At BM TURKIYE, we rebuild stable, natural smiles with implantology and modern prosthodontics. Our experienced team, advanced technology, and transparent planning keep your treatment predictable from first message to final check-up."
    },
    ru: {
      description:
        "В BM TURKIYE мы восстанавливаем стабильные и естественные улыбки с помощью имплантологии и современного протезирования. Прозрачное планирование и опытная команда обеспечивают предсказуемый результат."
    }
  },
  "hollywood-smile": {
    en: {
      description:
        "At BM TURKIYE, we're dedicated to your dental well-being. Our experienced team, advanced technology, and personalized care ensure a healthy, confident smile. Let us redefine your dental experience. Contact us today for a brighter, healthier smile."
    }
  }
};

export const getDefaultFooterSettings = (site = "hollywood-smile", locale = "en") => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const lang = normalizeLocale(locale);
  return {
    ...BASE_DEFAULTS,
    ...(lang === "ru" ? RU_DEFAULTS : {}),
    ...(SITE_OVERRIDES[siteId]?.[lang] || {})
  };
};
