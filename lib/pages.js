import { prisma } from "./prisma";

const DEFAULT_PAGE_COPY = {
  thankyou: {
    en: {
      title: "Thank You",
      content:
        "Thank you for trusting our clinic.\n\nWe received your request and are preparing the best plan for you.\n\nA patient coordinator will review your details, call you to confirm the next steps, and share the available time slots.\n\nIf you would like to talk now, use the call or WhatsApp buttons below."
    },
    ru: {
      title: "Спасибо",
      content:
        "Спасибо за доверие к нашей клинике.\n\nМы получили ваш запрос и готовим для вас лучший план лечения.\n\nКоординатор по работе с пациентами рассмотрит ваши данные, свяжется с вами по телефону, чтобы подтвердить следующие шаги, и сообщит о доступных временных слотах.\n\nЕсли хотите поговорить сейчас, воспользуйтесь кнопками звонка или WhatsApp ниже."
    }
  },
  "privacy-policy": {
    en: {
      title: "Privacy Policy",
      content:
        "We value your privacy and are committed to protecting your personal information.\n\nWe only collect data that is necessary to provide our services, improve your experience, and communicate with you when needed.\n\nWe do not sell or share your information with third parties except where required by law or to deliver services you have requested.\n\nYou can request access to your data or ask us to delete it at any time by contacting our support team."
    },
    ru: {
      title: "Политика конфиденциальности",
      content:
        "Мы ценим вашу конфиденциальность и обязуемся защищать вашу личную информацию.\n\nМы собираем только те данные, которые необходимы для предоставления услуг, улучшения вашего опыта и связи с вами при необходимости.\n\nМы не продаём и не передаём вашу информацию третьим лицам, кроме случаев, предусмотренных законом или необходимых для оказания запрошенных вами услуг.\n\nВы можете запросить доступ к своим данным или попросить удалить их в любое время, связавшись с нашей службой поддержки."
    }
  },
  terms: {
    en: {
      title: "Terms",
      content:
        "By using this website, you agree to the following terms and conditions.\n\nAll content is provided for informational purposes only and does not replace professional medical advice.\n\nAppointments, pricing, and treatment plans are confirmed after clinical assessment.\n\nWe reserve the right to update these terms at any time. Continued use of the website indicates your acceptance of any changes."
    },
    ru: {
      title: "Условия",
      content:
        "Используя этот сайт, вы соглашаетесь со следующими условиями.\n\nВся информация предоставляется только в ознакомительных целях и не заменяет профессиональную медицинскую консультацию.\n\nЗаписи, стоимость и планы лечения подтверждаются после клинической оценки.\n\nМы оставляем за собой право обновлять эти условия в любое время. Продолжая пользоваться сайтом, вы подтверждаете согласие с изменениями."
    }
  }
};

const DEFAULT_PAGES = Object.entries(DEFAULT_PAGE_COPY).flatMap(
  ([slug, locales]) => {
    const en = locales.en;
    const ru = locales.ru;
    return [
      { slug, ...en },
      { slug: `${slug}-en`, ...en },
      { slug: `${slug}-ru`, ...ru }
    ];
  }
);

const ensurePages = async () => {
  const existing = await prisma.page.findMany({ select: { slug: true } });
  const existingSlugs = new Set(existing.map((item) => item.slug));

  const createData = DEFAULT_PAGES.filter(
    (page) => !existingSlugs.has(page.slug)
  );

  if (createData.length) {
    await prisma.page.createMany({ data: createData, skipDuplicates: true });
  }
};

export const getPageBySlug = async (slug, locale) => {
  await ensurePages();
  const normalizedLocale = String(locale || "").toLowerCase();
  if (normalizedLocale) {
    const localized = await prisma.page.findUnique({
      where: { slug: `${slug}-${normalizedLocale}` }
    });
    if (localized) return localized;
  }
  return prisma.page.findUnique({ where: { slug } });
};

export const getPages = async () => {
  await ensurePages();
  return prisma.page.findMany({ orderBy: { title: "asc" } });
};
