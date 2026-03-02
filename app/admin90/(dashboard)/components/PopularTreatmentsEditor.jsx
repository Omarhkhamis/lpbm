"use client";

import { useState } from "react";

import FieldInput from "./FieldInput";

const emptyFaq = {
  question: "",
  answer: ""
};

const emptyService = {
  title: "",
  description: "",
  image: "",
  alt: "",
  faqs: [emptyFaq]
};

const normalizeFaq = (faq) => ({
  question: String(faq?.question || ""),
  answer: String(faq?.answer || "")
});

const normalizeService = (item) => {
  const faqs = Array.isArray(item?.faqs) && item.faqs.length
    ? item.faqs.map(normalizeFaq)
    : [emptyFaq];
  return {
    title: String(item?.title || ""),
    description: String(item?.description || ""),
    image: String(item?.image || ""),
    alt: String(item?.alt || ""),
    faqs
  };
};

const buildServiceLabel = (index, label) => `Service #${index + 1} ${label}`;
const buildFaqLabel = (serviceIndex, faqIndex, label) =>
  `Service #${serviceIndex + 1} FAQ #${faqIndex + 1} ${label}`;

export default function PopularTreatmentsEditor({ initialItems }) {
  const [services, setServices] = useState(
    Array.isArray(initialItems) && initialItems.length
      ? initialItems.map(normalizeService)
      : [emptyService]
  );

  const addService = () => {
    setServices((prev) => [...prev, emptyService]);
  };

  const removeService = (index) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const addFaq = (serviceIndex) => {
    setServices((prev) =>
      prev.map((service, index) =>
        index === serviceIndex
          ? { ...service, faqs: [...service.faqs, emptyFaq] }
          : service
      )
    );
  };

  const removeFaq = (serviceIndex, faqIndex) => {
    setServices((prev) =>
      prev.map((service, index) => {
        if (index !== serviceIndex) return service;
        const nextFaqs = service.faqs.filter((_, i) => i !== faqIndex);
        return {
          ...service,
          faqs: nextFaqs.length ? nextFaqs : [emptyFaq]
        };
      })
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
        Popular Treatments Services & FAQs
      </p>
      <div className="mt-4 space-y-5">
        {services.map((service, serviceIndex) => (
          <div
            key={`service-${serviceIndex}`}
            className="rounded-xl border border-slate-200 bg-slate-50/40 p-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldInput
                name={`field.items.${serviceIndex}.title`}
                label={buildServiceLabel(serviceIndex, "Title")}
                defaultValue={service.title}
              />
              <FieldInput
                name={`field.items.${serviceIndex}.alt`}
                label={buildServiceLabel(serviceIndex, "Image Alt")}
                defaultValue={service.alt}
              />
              <FieldInput
                name={`field.items.${serviceIndex}.description`}
                label={buildServiceLabel(serviceIndex, "Description")}
                defaultValue={service.description}
                isTextarea
              />
              <FieldInput
                name={`field.items.${serviceIndex}.image`}
                label={buildServiceLabel(serviceIndex, "Image URL")}
                defaultValue={service.image}
              />
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Service #{serviceIndex + 1} FAQs
              </p>
              <div className="mt-3 space-y-3">
                {service.faqs.map((faq, faqIndex) => (
                  <div
                    key={`service-${serviceIndex}-faq-${faqIndex}`}
                    className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
                  >
                    <div className="grid gap-3">
                      <FieldInput
                        name={`field.items.${serviceIndex}.faqs.${faqIndex}.question`}
                        label={buildFaqLabel(serviceIndex, faqIndex, "Question")}
                        defaultValue={faq.question}
                      />
                      <FieldInput
                        name={`field.items.${serviceIndex}.faqs.${faqIndex}.answer`}
                        label={buildFaqLabel(serviceIndex, faqIndex, "Answer")}
                        defaultValue={faq.answer}
                        isTextarea
                      />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeFaq(serviceIndex, faqIndex)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                        aria-label={`Remove faq ${faqIndex + 1} from service ${serviceIndex + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <input
                type="hidden"
                name={`popularTreatmentFaqLength.${serviceIndex}`}
                value={service.faqs.length}
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => addFaq(serviceIndex)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:border-slate-300"
                >
                  Add FAQ
                </button>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => removeService(serviceIndex)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                aria-label={`Remove service ${serviceIndex + 1}`}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <input type="hidden" name="popularTreatmentsLength" value={services.length} />
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={addService}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-300"
        >
          Add service
        </button>
      </div>
    </div>
  );
}
