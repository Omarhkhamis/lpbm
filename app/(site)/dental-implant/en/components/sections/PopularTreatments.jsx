"use client";

import { useEffect, useMemo, useState } from "react";
import { popularTreatmentsDefaults } from "../../../../../../lib/sectionDefaults";
import WhatsAppTriggerButton from "../../../../components/WhatsAppTriggerButton";

const normalizeFaqs = (faqs) =>
  Array.isArray(faqs)
    ? faqs
        .map((item) => ({
          question: String(item?.question || "").trim(),
          answer: String(item?.answer || "").trim()
        }))
        .filter((item) => item.question || item.answer)
    : [];

export default function PopularTreatments({ data, whatsappLink, locale = "en" }) {
  const content = data || popularTreatmentsDefaults;
  const treatments = content.items || [];
  const isRu = locale === "ru";
  const labels = {
    readMoreLabel: content.readMoreLabel || (isRu ? "Подробнее" : "Read more"),
    faqTitle: content.faqTitle || (isRu ? "Часто задаваемые вопросы" : "Frequently Asked Questions"),
    consultationText:
      content.consultationText ||
      (isRu
        ? "Если у вас есть вопросы, свяжитесь с нами."
        : "If you have any questions, contact us."),
    contactButtonLabel:
      content.contactButtonLabel || (isRu ? "Свяжитесь с нами" : "Contact us"),
    closeLabel: content.closeLabel || (isRu ? "Закрыть" : "Close")
  };
  const [current, setCurrent] = useState(0);
  const [activeTreatment, setActiveTreatment] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);
  const total = treatments.length || 1;
  const activeFaqs = useMemo(
    () => normalizeFaqs(activeTreatment?.faqs),
    [activeTreatment]
  );
  const activeImage = useMemo(
    () =>
      activeTreatment?.image ||
      activeTreatment?.poster ||
      activeTreatment?.src ||
      "",
    [activeTreatment]
  );

  useEffect(() => {
    if (!activeTreatment) return undefined;
    setImageFailed(false);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveTreatment(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTreatment]);

  const goTo = (direction) => {
    setCurrent((prev) => {
      const next = (prev + direction + total) % total;
      return next;
    });
  };

  const renderCard = (item) => (
    <article
      key={item.title}
      className="group rounded-3xl bg-white border border-main-200/70 overflow-hidden"
    >
      <div className="relative aspect-[16/10] bg-main-50">
        <img
          src={item.image}
          alt={item.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10"></div>
      </div>

      <div className="p-6 lg:p-7">
        <h3 className="text-lg lg:text-[19px] font-light text-main-900">
          {item.title}
        </h3>

        <div className="mt-3 h-[1px] w-16 rounded-full bg-copper-500/80"></div>

        <p className="mt-4 text-sm leading-relaxed text-main-600 font-light">
          {item.description}
        </p>

        <button
          type="button"
          onClick={() => setActiveTreatment(item)}
          className="mt-7 inline-flex items-center gap-2 text-[15px] font-light cursor-pointer text-copper-700 hover:text-copper-900 transition"
        >
          {labels.readMoreLabel}
        </button>
      </div>
    </article>
  );

  return (
    <section
      id="popular-treatments"
      className="relative bg-gradient-to-b from-gray-50 via-white to-gray-100 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-medium tracking-[0.32em] uppercase text-main-400">
            {content.kicker}
          </p>

          <h2 className="mt-3 text-3xl sm:text-3xl lg:text-5xl font-extralight text-main-900 tracking-tight">
            {content.title}
          </h2>

          <p className="mt-4 text-sm sm:text-[17px] font-light text-main-600">
            {content.description}
          </p>
        </div>

        <div className="mt-10 lg:mt-14">
          {treatments.length ? (
            <div className="relative sm:hidden">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${current * 100}%)` }}
                >
                  {treatments.map((item) => (
                    <div key={item.title} className="w-full flex-shrink-0 pr-4 last:pr-0">
                      {renderCard(item)}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md border border-main-200 text-main-700 hover:text-main-900 h-10 w-10 flex items-center justify-center"
                onClick={() => goTo(-1)}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md border border-main-200 text-main-700 hover:text-main-900 h-10 w-10 flex items-center justify-center"
                onClick={() => goTo(1)}
                aria-label="Next"
              >
                ›
              </button>
            </div>
          ) : null}

          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatments.map((item) => renderCard(item))}
          </div>
        </div>
      </div>
      {activeTreatment ? (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm"
          onClick={() => setActiveTreatment(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-[0_35px_100px_rgba(0,0,0,0.32)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label={labels.closeLabel}
              onClick={() => setActiveTreatment(null)}
              className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-copper-200 hover:text-copper-700"
            >
              ×
            </button>

            <div className="max-h-[85svh] overflow-y-auto p-5 md:p-6">
              <div className="relative mb-5 h-56 sm:h-64 overflow-hidden rounded-2xl border border-main-200 bg-main-50">
                {activeImage && !imageFailed ? (
                  <img
                    src={activeImage}
                    alt={activeTreatment.alt || activeTreatment.title}
                    onError={() => setImageFailed(true)}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-main-500">
                    Image unavailable
                  </div>
                )}
              </div>
              <h3 className="pr-10 text-2xl font-light text-main-900">
                {activeTreatment.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-main-600">
                {activeTreatment.description}
              </p>

              <div className="mt-6">
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-main-500">
                  {labels.faqTitle}
                </p>
                {activeFaqs.length ? (
                  <div className="mt-4 space-y-4">
                    {activeFaqs.map((faq, index) => (
                      <div key={`${activeTreatment.title}-faq-${index}`}>
                        <p className="text-sm font-medium text-main-900">
                          {faq.question}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-main-600">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-main-500">-</p>
                )}
              </div>

              <p className="mt-8 text-sm text-main-600">{labels.consultationText}</p>
              <WhatsAppTriggerButton
                href={whatsappLink || "#"}
                trackingName="dental_implant_popular_treatments_cta"
                className="mt-3 inline-flex items-center rounded-xl bg-gradient-to-r from-copper-600 to-copper-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:from-copper-700 hover:to-copper-600"
              >
                <i className="fa-brands fa-whatsapp mr-2" aria-hidden="true"></i>
                {labels.contactButtonLabel}
                            </WhatsAppTriggerButton>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
