"use client";

import { useEffect, useRef } from "react";

const LUCKY_SPIN_SECTION_ID = "lucky-spin-section";

export default function Overlays({
  whatsappLink,
  locale
}) {
  const spinButtonRef = useRef(null);
  const isRu = locale === "ru";
  const copy = {
    whatsappCta: isRu ? "Бесплатная консультация" : "Free Consultation",
    whatsappLabel: isRu ? "Бесплатная" : "Free",
    consultationLabel: isRu ? "Консультация" : "Consultation",
    openLuckySpin: isRu ? "Открыть Лаки-спин" : "Open Lucky Spin",
    tryChance: isRu ? "Испытай удачу!" : "Try your chance!"
  };

  const scrollToLuckySpin = () => {
    const section = document.getElementById(LUCKY_SPIN_SECTION_ID);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleLuckyOpen = () => scrollToLuckySpin();

    window.addEventListener("open-luckyspin", handleLuckyOpen);

    return () => {
      window.removeEventListener("open-luckyspin", handleLuckyOpen);
    };
  }, []);

  useEffect(() => {
    const button = spinButtonRef.current;
    if (!button) return;

    button.classList.remove("is-in", "is-idle");
    let handler;
    const timeoutId = window.setTimeout(() => {
      button.classList.add("is-in");
      handler = (event) => {
        if (event.animationName === "spinSlideIn") {
          button.classList.remove("is-in");
          button.classList.add("is-idle");
        }
      };
      button.addEventListener("animationend", handler);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (handler) button.removeEventListener("animationend", handler);
    };
  }, []);

  return (
    <>
      <a
        href={whatsappLink || "#"}
        target="_blank"
        rel="noreferrer"
        aria-label={copy.whatsappCta}
        className="fixed bottom-6 lg:hover:-translate-y-0.5  transition left-4 lg:bottom-7 sm:left-7 z-[9999]"
        onClick={(event) => {
          if (!whatsappLink) event.preventDefault();
        }}
      >
        <div className="relative rounded-xl p-[1.2px] wa-shimmer-border">
          <div className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 border border-main-200/60">
            <span className="h-6 w-px bg-main-400/40"></span>

            <span className="flex flex-col leading-tight">
              <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-main-900">
                <span className="inline-flex items-center">
                  <i className="fa-brands fa-whatsapp mr-1.5 text-[12px]" aria-hidden="true"></i>
                  {copy.whatsappLabel}
                </span>
              </span>
              <span className="text-[9.5px] mt-0.5 uppercase tracking-[0.32em] text-copper-700">
                {copy.consultationLabel}
              </span>
            </span>

            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500/80"></span>
          </div>
        </div>
      </a>

      <button
        type="button"
        className="hidden md:block wheel-toggle fixed small-spin z-[999] spin-enter bottom-8 right-9 cursor-pointer bg-transparent border-0 p-0"
        onClick={scrollToLuckySpin}
        ref={spinButtonRef}
        aria-label={copy.openLuckySpin}
      >
        <img
          src="/uploads/lucky-spin-small.png"
          width="50"
          alt="partials.spin-show-hide"
        />
      </button>

      <button
        type="button"
        className="hidden md:block md:fixed bottom-8 md:right-16 z-[99] cursor-pointer select-none cta-after-spin bg-transparent border-0 p-0"
        onClick={scrollToLuckySpin}
        aria-label={copy.openLuckySpin}
      >
        <div
          className="relative inline-block p-[1.5px]"
          style={{
            borderRadius: "7px",
            background:
              "linear-gradient(90deg, color-mix(in srgb, var(--color-copper-600) 45%, transparent), color-mix(in srgb, var(--color-copper-400) 20%, transparent), transparent)"
          }}
        >
          <div
            className="relative overflow-hidden pl-5 pr-7.5 py-1.5 text-[13px] italic font-normal tracking-tight bg-white/95 backdrop-blur text-copper-800"
            style={{ borderRadius: "6px" }}
          >
            {copy.tryChance}
            <span className="relative ml-1 not-italic text-[15px] text-copper-700/60">
              &rsaquo;
            </span>
          </div>
        </div>
      </button>
    </>
  );
}
