import { DEFAULT_GENERAL_SETTINGS } from "../../../../../lib/generalSettings";
import { getDefaultFooterSettings } from "../../../../../lib/footerDefaults";

export default function Footer({ general, footer, locale, site }) {
  const settings = general || DEFAULT_GENERAL_SETTINGS;
  const defaults = getDefaultFooterSettings(site, locale);
  const footerData = {
    ...defaults,
    ...(footer || {})
  };
  const footerPhone = footerData.phone || settings.phone;
  const phoneLink = footerPhone
    ? `tel:${footerPhone.replace(/\s+/g, "")}`
    : "tel:+905382112583";
  const whatsappNumber = footerData.whatsappNumber
    ? footerData.whatsappNumber.replace(/\s+/g, "")
    : settings.whatsappNumber
      ? settings.whatsappNumber.replace(/\s+/g, "")
    : null;
  const whatsappLink =
    settings.whatsappLink ||
    footerData.whatsappLink ||
    (whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/+905382112583");
  const logoSrc = footerData.footerLogoUrl || settings.logoUrl || "/uploads/bm-logo-brown.svg";
  const footerEmail = footerData.email || settings.email;
  const footerAddress = footerData.address || settings.address;
  const emailLink = footerEmail ? `mailto:${footerEmail}` : "mailto:info@bmturkiye.com";
  const instagramLink = footerData.instagram || settings.social?.instagram || "#";
  const facebookLink = footerData.facebook || settings.social?.facebook || "#";
  const youtubeLink = footerData.youtube || settings.social?.youtube || "#";
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
                  {footerData.description}
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
                {footerData.badge}
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
                {footerData.navTreatments}
              </a>

              <a
                href="#popular-treatments"
                className="group inline-flex items-center gap-2 text-gray-600 hover:text-copper-900 transition"
              >
                <span className="h-1 w-1 rounded-full bg-gray-300 group-hover:bg-copper-400 transition"></span>
                {footerData.navPopularTreatments}
              </a>

              <a
                href="#before-after"
                className="group inline-flex items-center gap-2 text-gray-600 hover:text-copper-900 transition"
              >
                <span className="h-1 w-1 rounded-full bg-gray-300 group-hover:bg-copper-400 transition"></span>
                {footerData.navBeforeAfter}
              </a>

              <a
                href="#google-reviews"
                className="group inline-flex items-center gap-2 text-gray-600 hover:text-copper-900 transition"
              >
                <span className="h-1 w-1 rounded-full bg-gray-300 group-hover:bg-copper-400 transition"></span>
                {footerData.navTestimonials}
              </a>

              <a
                href="#faqs"
                className="group inline-flex items-center gap-2 text-gray-600 hover:text-copper-900 transition"
              >
                <span className="h-1 w-1 rounded-full bg-gray-300 group-hover:bg-copper-400 transition"></span>
                {footerData.navFaqs}
              </a>

              <a
                href="#health-tourism"
                className="group inline-flex items-center gap-2 text-gray-600 hover:text-copper-900 transition"
              >
                <span className="h-1 w-1 rounded-full bg-gray-300 group-hover:bg-copper-400 transition"></span>
                {footerData.navHealthTourism}
              </a>
            </div>

            <p className="mt-6 text-xs text-gray-500 font-light leading-relaxed max-w-sm">
              {footerData.note}
            </p>
          </div>

          <div className="lg:col-span-3 sm:max-w-80 ">
            <div className="space-y-2 text-sm font-light text-gray-600">
              <p>
                <span className="font-medium text-copper-900">{footerData.phoneLabel}:</span>
                <a
                  className="hover:text-copper-900 transition"
                  href={phoneLink}
                >
                  {footerPhone}
                </a>
              </p>

              <p>
                <span className="font-medium text-copper-900">{footerData.whatsappLabel}:</span>
                <a
                  className="hover:text-copper-900 transition"
                  target="_blank"
                  rel="noreferrer"
                  href={whatsappLink}
                >
                  {footerData.whatsappNumber}
                </a>
              </p>

              <p>
                <span className="font-medium text-copper-900">{footerData.emailLabel}:</span>
                <a
                  className="hover:text-copper-900 transition"
                  href={emailLink}
                >
                  {footerEmail}
                </a>
              </p>

              <p className="leading-relaxed">
                <span className="font-medium text-copper-900">{footerData.addressLabel}:</span>
                {footerAddress}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        <div className="mb-20 xl:mb-0 mx-auto flex w-full md:max-w-max flex-col md:flex-row items-start md:items-center md:justify-between gap-6 xl:gap-23 py-6 text-xs text-gray-500">
          <p>{footerData.copyright}</p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={buildPageLink("/privacy-policy")}
              className="bg-transparent p-0 border-0 hover:text-gray-800 transition"
            >
              {footerData.privacy}
            </a>
            <span className="text-gray-300">|</span>
            <a
              href={buildPageLink("/terms")}
              className="bg-transparent p-0 border-0 hover:text-gray-800 transition"
            >
              {footerData.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
