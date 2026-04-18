"use client";

import { useEffect } from "react";

import { DEFAULT_GENERAL_SETTINGS } from "../../../../../lib/generalSettings";
import LocaleDropdown from "./LocaleDropdown";
import WhatsAppTriggerButton from "../../../components/WhatsAppTriggerButton";

export default function Header({ general, footer, locale = "en" }) {
  const settings = general || DEFAULT_GENERAL_SETTINGS;
  const whatsappNumber = footer?.whatsappNumber
    ? footer.whatsappNumber.replace(/\s+/g, "")
    : settings.whatsappNumber
      ? settings.whatsappNumber.replace(/\s+/g, "")
    : null;
  const whatsappLink =
    settings.whatsappLink ||
    footer?.whatsappLink ||
    (whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/+905382112583");
  const logoSrc = settings.logoUrl || "/uploads/bm-logo-brown.svg";
  useEffect(() => {
    const headerEl = document.getElementById("siteHeader");
    if (!headerEl) return;

    const onScroll = () => {
      if (window.scrollY > 10) {
        headerEl.classList.remove("bg-transparent");
        headerEl.classList.add(
          "bg-slate-950/95",
          "backdrop-blur",
          "shadow-lg",
          "border-b",
          "border-white/5"
        );
      } else {
        headerEl.classList.add("bg-transparent");
        headerEl.classList.remove(
          "bg-slate-950/95",
          "backdrop-blur",
          "shadow-lg",
          "border-b",
          "border-white/5"
        );
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="siteHeader"
      className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100 shadow-sm transition-colors duration-300 ease-out"
    >
      <div className="mx-auto max-w-screen-2xl w-full px-6 lg:px-10">
        <div className="flex h-24 items-center justify-between gap-6">
          <a href={`/hollywood-smile/${locale}`} className="flex items-center">
            <img
              src={logoSrc}
              alt="BM TÜRKIEY"
              className="h-9 md:h-10 md:-mt-1 w-auto"
            />
          </a>

          <div className="flex items-center gap-2 sm:gap-3">
            <WhatsAppTriggerButton
              href={whatsappLink}
              trackingName="hollywood_smile_header_cta"
              className="rounded-xl bg-gradient-to-r from-copper-700 via-copper-600 to-copper-500 font-normal uppercase text-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] hover:from-copper-800 hover:via-copper-700 hover:to-copper-500 hover:shadow-[0_12px_36px_rgba(0,0,0,0.18)] active:scale-[0.97] !py-2 sm:!py-2 !px-3 sm:!px-4 !text-[11px] sm:!text-[12px] !tracking-[0.01em] sm:!tracking-[0.20em] inline-flex items-center justify-center cursor-pointer transition-transform duration-200 ease-out disabled:opacity-60 disabled:pointer-events-none"
            >
              <i className="fa-brands fa-whatsapp mr-2" aria-hidden="true"></i>
              {locale === "ru" ? "Записаться" : "Book Consultation"}
                        </WhatsAppTriggerButton>
            <LocaleDropdown locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
