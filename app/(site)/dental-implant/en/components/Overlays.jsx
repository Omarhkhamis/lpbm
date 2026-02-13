"use client";

import { useEffect, useRef, useState } from "react";

import LuckySpinFormSec from "./sections/LuckySpinFormSec";
import ConsultationFormCard from "./ConsultationFormCard";
import { heroDefaults } from "../../../../../lib/sectionDefaults";

const BODY_LOCK_CLASS = "overflow-hidden";

export default function Overlays({
  heroData,
  consultationDelaySeconds,
  whatsappLink,
  luckySpinData,
  locale,
  site
}) {
  const [isLuckyOpen, setIsLuckyOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const spinButtonRef = useRef(null);
  const resolvedForm = heroData?.form || heroDefaults.form;
  const isRu = locale === "ru";
  const copy = {
    close: isRu ? "Закрыть" : "Close",
    whatsappCta: isRu ? "Бесплатная консультация" : "Free Consultation",
    whatsappLabel: isRu ? "Бесплатная" : "Free",
    consultationLabel: isRu ? "Консультация" : "Consultation",
    openLuckySpin: isRu ? "Открыть Лаки-спин" : "Open Lucky Spin",
    tryChance: isRu ? "Испытай удачу!" : "Try your chance!"
  };

  useEffect(() => {
    const handleLuckyOpen = () => setIsLuckyOpen(true);
    const handleLuckyClose = () => setIsLuckyOpen(false);
    const handleConsultationOpen = () => setIsConsultationOpen(true);
    const handleConsultationClose = () => setIsConsultationOpen(false);
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setIsLuckyOpen(false);
      setIsConsultationOpen(false);
    };

    window.addEventListener("open-luckyspin", handleLuckyOpen);
    window.addEventListener("close-luckyspin", handleLuckyClose);
    window.addEventListener("open-book-consultation", handleConsultationOpen);
    window.addEventListener(
      "close-book-consultation",
      handleConsultationClose
    );
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-luckyspin", handleLuckyOpen);
      window.removeEventListener("close-luckyspin", handleLuckyClose);
      window.removeEventListener(
        "open-book-consultation",
        handleConsultationOpen
      );
      window.removeEventListener(
        "close-book-consultation",
        handleConsultationClose
      );
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const isAnyOpen = isLuckyOpen || isConsultationOpen;
    document.body.classList.toggle(BODY_LOCK_CLASS, isAnyOpen);
    return () => {
      document.body.classList.remove(BODY_LOCK_CLASS);
    };
  }, [isLuckyOpen, isConsultationOpen]);

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

  useEffect(() => {
    const delayMs =
      typeof consultationDelaySeconds === "number" && consultationDelaySeconds >= 0
        ? consultationDelaySeconds * 1000
        : 10000;
    const timeoutId = window.setTimeout(() => {
      setIsConsultationOpen(true);
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [consultationDelaySeconds]);

  const handleOpen = () => setIsLuckyOpen(true);
  const handleClose = () => setIsLuckyOpen(false);
  const handleConsultationClose = () => setIsConsultationOpen(false);
  const handleConsultationOpen = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("open-book-consultation"));
  };

  return (
    <>
      {isConsultationOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-sm"
            onClick={handleConsultationClose}
          ></div>
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center px-3 sm:px-5 py-4 sm:py-5 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            onClick={handleConsultationClose}
          >
            <div
              className="relative w-full max-w-lg"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="absolute -top-4 right-3 z-50 h-9.5 w-9.5 inline-flex items-center justify-center rounded-full border bg-white/90 text-gray-700 border-1 border-gray-200 backdrop-blur hover:bg-gray-50 hover:border-copper-200 hover:text-copper-700 cursor-pointer"
                onClick={handleConsultationClose}
                aria-label={copy.close}
              >
                X
              </button>
              <ConsultationFormCard
                form={resolvedForm}
                idPrefix="consultation-modal"
                className="w-full"
              />
            </div>
          </div>
        </>
      )}

      {isLuckyOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-sm"
            onClick={handleClose}
          ></div>
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center px-3 sm:px-5 py-4 sm:py-5 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            onClick={handleClose}
          >
            <div
              className="relative w-full max-w-7xl rounded-3xl overflow-auto shadow-[0_30px_90px_rgba(0,0,0,0.32)] max-h-[calc(100svh-2rem)] sm:max-h-none"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="absolute top-5 right-6 z-50 h-9.5 w-9.5 inline-flex items-center justify-center rounded-full border bg-white/85 text-gray-700 border-1 border-gray-200 backdrop-blur hover:bg-gray-50 hover:border-copper-200 hover:text-copper-700 cursor-pointer"
                onClick={handleClose}
                aria-label={copy.close}
              >
                X
              </button>
              <LuckySpinFormSec
                idPrefix="lucky-modal"
                data={luckySpinData}
                locale={locale}
                site={site}
              />
            </div>
          </div>
        </>
      )}

      <button
        type="button"
        aria-label={copy.whatsappCta}
        className="fixed bottom-6 lg:hover:-translate-y-0.5  transition left-4 lg:bottom-7 sm:left-7 z-[9999]"
        onClick={handleConsultationOpen}
      >
        <div className="relative rounded-xl p-[1.2px] wa-shimmer-border">
          <div className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 border border-main-200/60">
            <span className="h-6 w-px bg-main-400/40"></span>

            <span className="flex flex-col leading-tight">
              <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-main-900">
                {copy.whatsappLabel}
              </span>
              <span className="text-[9.5px] mt-0.5 uppercase tracking-[0.32em] text-copper-700">
                {copy.consultationLabel}
              </span>
            </span>

            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500/80"></span>
          </div>
        </div>
      </button>

      <button
        type="button"
        className="hidden md:block wheel-toggle fixed small-spin z-[999] spin-enter bottom-8 right-9 cursor-pointer bg-transparent border-0 p-0"
        onClick={handleOpen}
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
        onClick={handleOpen}
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
