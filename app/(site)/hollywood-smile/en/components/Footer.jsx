import { DEFAULT_GENERAL_SETTINGS } from "../../../../../lib/generalSettings";

export default function Footer({ general, locale, site }) {
  const settings = general || DEFAULT_GENERAL_SETTINGS;
  const isRu = locale === "ru";
  const copy = {
    description: isRu
      ? "В BM TÜRKIEY мы заботимся о здоровье ваших зубов. Опытная команда, современные технологии и индивидуальный подход помогают сохранить здоровую и уверенную улыбку. Давайте вместе изменим ваше стоматологическое впечатление. Свяжитесь с нами уже сегодня — для более яркой и здоровой улыбки."
      : "At BM TÜRKIEY, we're dedicated to your dental well-being. Our experienced team, advanced technology, and personalized care ensure a healthy, confident smile. Let us redefine your dental experience. Contact us today for a brighter, healthier smile.",
    badge: isRu
      ? "Современная стоматология • Индивидуальный подход"
      : "Advanced dentistry • Personalised care",
    nav: {
      treatments: isRu ? "Процедуры" : "Treatments",
      popularTreatments: isRu ? "Популярные процедуры" : "Popular Treatments",
      beforeAfter: isRu ? "До и после" : "Before & After",
      testimonials: isRu ? "Отзывы" : "Testimonials",
      faqs: isRu ? "Вопросы и ответы" : "FAQs",
      healthTourism: isRu ? "Медицинский туризм" : "Health Tourism"
    },
    note: isRu
      ? "Комфортный опыт, понятный план и премиальные результаты."
      : "Comfortable experience, clear planning, and premium results.",
    labels: {
      phone: isRu ? "Телефон" : "Phone",
      whatsapp: "WhatsApp",
      email: isRu ? "мейл" : "E-mail",
      address: isRu ? "Адрес" : "Address"
    },
    copyright: isRu
      ? "© 2025 BM TÜRKIEY. Все права защищены."
      : "© 2025 BM TÜRKIEY. All Rights Reserved.",
    privacy: isRu ? "Политика конфиденциальности" : "Privacy Policy",
    terms: isRu ? "Условия" : "Terms"
  };
  const phoneLink = settings.phone
    ? `tel:${settings.phone.replace(/\s+/g, "")}`
    : "tel:+905465266449";
  const whatsappNumber = settings.whatsappNumber
    ? settings.whatsappNumber.replace(/\s+/g, "")
    : null;
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : "https://wa.me/+905465266449";
  const logoSrc = settings.logoUrl || "/uploads/bm-logo-brown.svg";
  const emailLink = settings.email ? `mailto:${settings.email}` : "mailto:info@atomclinic.com";
  const instagramLink = settings.social?.instagram || "#";
  const facebookLink = settings.social?.facebook || "#";
  const youtubeLink = settings.social?.youtube || "#";
  const buildPageLink = (path) => {
    const params = new URLSearchParams();
    if (locale) params.set("locale", locale);
    if (site) params.set("site", site);
    const query = params.toString();
    return query ? `${path}?${query}` : path;
  };
  return (
    <footer className="relative overflow-hidden bg-white border-t border-gray-200/70">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-copper-400/60 to-transparent"></div>
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-copper-300/10 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-copper-300/10 blur-3xl"></div>

      <div className="mx-auto max-w-screen-2xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-12 lg:py-20">
          <div className="lg:col-span-5 space-y-5">
            <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10">
              <img
                src={logoSrc}
                alt="BM TÜRKIEY"
                className="h-16 w-auto"
              />

              <div className="space-y-2 mt-4 sm:mt-0">
                <p className="text-sm font-light text-gray-600 leading-relaxed lg:max-w-md">
                  {copy.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 pt-1">
              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="group inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200/80 bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur transition hover:border-copper-200 hover:shadow-[0_10px_40px_rgba(176,122,90,0.18)] focus:outline-none focus:ring-2 focus:ring-copper-200/60 focus:ring-offset-2"
              >
                <i className="fa-brands fa-instagram text-[12px] text-gray-700 transition group-hover:text-copper-900"></i>
              </a>

              <a
                href={facebookLink}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="group inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200/80 bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur transition hover:border-copper-200 hover:shadow-[0_10px_40px_rgba(176,122,90,0.18)] focus:outline-none focus:ring-2 focus:ring-copper-200/60 focus:ring-offset-2"
              >
                <i className="fa-brands fa-facebook-f text-[12px] text-gray-700 transition group-hover:text-copper-900"></i>
              </a>

              <a
                href={youtubeLink}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="group inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200/80 bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur transition hover:border-copper-200 hover:shadow-[0_10px_40px_rgba(176,122,90,0.18)] focus:outline-none focus:ring-2 focus:ring-copper-200/60 focus:ring-offset-2"
              >
                <i className="fa-brands fa-youtube text-[12px] text-gray-700 transition group-hover:text-copper-900"></i>
              </a>

              <div className="inline-flex ml-4 items-center gap-2 rounded-full border border-copper-200/60 bg-white/60 px-3 py-1 text-[11px] text-gray-600">
                <span className="h-1.5 w-1.5 rounded-full bg-copper-400"></span>
                {copy.badge}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm font-light">
              <a
                href="#treatments"
                className="group inline-flex items-center gap-2 text-gray-600 hover:text-copper-900 transition"
              >
                <span className="h-1 w-1 rounded-full bg-gray-300 group-hover:bg-copper-400 transition"></span>
                {copy.nav.treatments}
              </a>

              <a
                href="#popular-treatments"
                className="group inline-flex items-center gap-2 text-gray-600 hover:text-copper-900 transition"
              >
                <span className="h-1 w-1 rounded-full bg-gray-300 group-hover:bg-copper-400 transition"></span>
                {copy.nav.popularTreatments}
              </a>

              <a
                href="#before-after"
                className="group inline-flex items-center gap-2 text-gray-600 hover:text-copper-900 transition"
              >
                <span className="h-1 w-1 rounded-full bg-gray-300 group-hover:bg-copper-400 transition"></span>
                {copy.nav.beforeAfter}
              </a>

              <a
                href="#google-reviews"
                className="group inline-flex items-center gap-2 text-gray-600 hover:text-copper-900 transition"
              >
                <span className="h-1 w-1 rounded-full bg-gray-300 group-hover:bg-copper-400 transition"></span>
                {copy.nav.testimonials}
              </a>

              <a
                href="#faqs"
                className="group inline-flex items-center gap-2 text-gray-600 hover:text-copper-900 transition"
              >
                <span className="h-1 w-1 rounded-full bg-gray-300 group-hover:bg-copper-400 transition"></span>
                {copy.nav.faqs}
              </a>

              <a
                href="#health-tourism"
                className="group inline-flex items-center gap-2 text-gray-600 hover:text-copper-900 transition"
              >
                <span className="h-1 w-1 rounded-full bg-gray-300 group-hover:bg-copper-400 transition"></span>
                {copy.nav.healthTourism}
              </a>
            </div>

            <p className="mt-6 text-xs text-gray-500 font-light leading-relaxed max-w-sm">
              {copy.note}
            </p>
          </div>

          <div className="lg:col-span-3 sm:max-w-80 ">
            <div className="space-y-2 text-sm font-light text-gray-600">
              <p>
                <span className="font-medium text-copper-900">{copy.labels.phone}:</span>
                <a
                  className="hover:text-copper-900 transition"
                  href={phoneLink}
                >
                  {settings.phone}
                </a>
              </p>

              <p>
                <span className="font-medium text-copper-900">{copy.labels.whatsapp}:</span>
                <a
                  className="hover:text-copper-900 transition"
                  target="_blank"
                  rel="noreferrer"
                  href={whatsappLink}
                >
                  {settings.whatsappNumber}
                </a>
              </p>

              <p>
                <span className="font-medium text-copper-900">{copy.labels.email}:</span>
                <a
                  className="hover:text-copper-900 transition"
                  href={emailLink}
                >
                  {settings.email}
                </a>
              </p>

              <p className="leading-relaxed">
                <span className="font-medium text-copper-900">{copy.labels.address}:</span>
                {settings.address}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        <div className="mb-20 xl:mb-0 mx-auto flex w-full md:max-w-max flex-col md:flex-row items-start md:items-center md:justify-between gap-6 xl:gap-23 py-6 text-xs text-gray-500">
          <p>{copy.copyright}</p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={buildPageLink("/privacy-policy")}
              className="bg-transparent p-0 border-0 hover:text-gray-800 transition"
            >
              {copy.privacy}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href={buildPageLink("/terms")}
              className="bg-transparent p-0 border-0 hover:text-gray-800 transition"
            >
              {copy.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
