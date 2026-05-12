export const DEFAULT_POPUP_FORM_SETTINGS_BY_LOCALE = {
  en: {
    popupFormTitle:
      "Hello there, you are about to get a free fast consultation via WhatsApp, would you like to proceed?",
    popupFormBody:
      "Contact us on WhatsApp now and get your Free Fly Ticket.",
    popupWhatsappMessage:
      "Hello, I would like to get a free fast consultation via WhatsApp and learn more about the Free Fly Ticket offer."
  },
  ru: {
    popupFormTitle:
      "Здравствуйте! Вы можете получить быструю бесплатную консультацию в WhatsApp. Хотите продолжить?",
    popupFormBody:
      "Свяжитесь с нами в WhatsApp сейчас и получите бесплатный авиабилет.",
    popupWhatsappMessage:
      "Здравствуйте, я хочу получить быструю бесплатную консультацию в WhatsApp и узнать больше о предложении бесплатного авиабилета."
  }
};

export const DEFAULT_POPUP_FORM_SETTINGS =
  DEFAULT_POPUP_FORM_SETTINGS_BY_LOCALE.en;

export const getDefaultPopupFormSettings = (locale = "en") => {
  const lang = String(locale || "").toLowerCase() === "ru" ? "ru" : "en";
  return DEFAULT_POPUP_FORM_SETTINGS_BY_LOCALE[lang];
};
