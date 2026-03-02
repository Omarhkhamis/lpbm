"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { teamMembersDefaults } from "../../../../../../lib/sectionDefaults";

const parseExpertise = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};

export default function TeamMembers({ data, whatsappLink }) {
  const content = data || teamMembersDefaults;
  const members = content.items || [];
  const sliderRef = useRef(null);
  const [activeMember, setActiveMember] = useState(null);
  const activeExpertise = useMemo(
    () => parseExpertise(activeMember?.expertise),
    [activeMember]
  );
  const labels = {
    readMoreLabel: content.readMoreLabel || "Read more",
    expertiseTitle: content.expertiseTitle || "Doctor experience",
    consultationText:
      content.consultationText || "If you have any questions, contact us.",
    contactButtonLabel: content.contactButtonLabel || "Contact us",
    closeLabel: content.closeLabel || "Close"
  };

  const scrollByAmount = (direction) => {
    const node = sliderRef.current;
    if (!node) return;
    const amount = Math.round(node.clientWidth * 0.9);
    const maxScrollLeft = node.scrollWidth - node.clientWidth;
    const atStart = node.scrollLeft <= 0;
    const atEnd = node.scrollLeft >= maxScrollLeft - 1;

    if (direction > 0 && atEnd) {
      node.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction < 0 && atStart) {
      node.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      return;
    }

    node.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  useEffect(() => {
    if (!activeMember) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveMember(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMember]);

  return (
    <section
      id="team-members"
      className="relative bg-gradient-to-b from-gray-100 via-white to-gray-50 py-16 lg:py-24"
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
          <div className="relative">
            <button
              type="button"
              aria-label="السابق"
              onClick={() => scrollByAmount(-1)}
              className="sm:hidden absolute -left-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-main-200 bg-white/90 p-3 text-main-700 shadow-md transition hover:bg-white"
            >
              {"<"}
            </button>
            <button
              type="button"
              aria-label="التالي"
              onClick={() => scrollByAmount(1)}
              className="sm:hidden absolute -right-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-main-200 bg-white/90 p-3 text-main-700 shadow-md transition hover:bg-white"
            >
              {">"}
            </button>

            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto pb-3 no-scrollbar snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4"
            >
            {members.map((member) => (
              <article
                key={member.name}
                className="group w-[85%] shrink-0 snap-start rounded-3xl bg-white border border-main-200/70 overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.05)] sm:w-auto"
              >
                <div className="relative aspect-[16/10] bg-main-50">
                  <img
                    src={member.image}
                    alt={member.alt || member.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/10"></div>
                </div>

                <div className="p-6 lg:p-7">
                  <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-copper-700/90">
                    {member.role}
                  </p>
                  <h3 className="mt-2 text-lg lg:text-[19px] font-light text-main-900">
                    {member.name}
                  </h3>

                  <div className="mt-3 h-[1px] w-16 rounded-full bg-copper-500/80"></div>

                  <p className="mt-4 text-sm leading-relaxed text-main-600 font-light">
                    {member.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => setActiveMember(member)}
                    className="mt-4 inline-flex items-center rounded-xl border border-copper-200 bg-copper-50/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-copper-800 transition hover:border-copper-300 hover:bg-copper-100/70"
                  >
                    {labels.readMoreLabel}
                  </button>
                </div>
              </article>
            ))}
            </div>
          </div>
        </div>
      </div>
      {activeMember ? (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm"
          onClick={() => setActiveMember(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-[0_35px_100px_rgba(0,0,0,0.32)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveMember(null)}
              aria-label={labels.closeLabel}
              className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-copper-200 hover:text-copper-700"
            >
              ×
            </button>
            <div className="grid gap-0 md:grid-cols-[240px_1fr]">
              <div className="relative min-h-[220px] bg-main-50">
                <img
                  src={activeMember.image}
                  alt={activeMember.alt || activeMember.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="max-h-[80svh] overflow-y-auto p-6 md:p-8">
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-copper-700/90">
                  {activeMember.role}
                </p>
                <h3 className="mt-2 text-2xl font-light text-main-900">
                  {activeMember.name}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-main-600">
                  {activeMember.description}
                </p>
                {activeMember.bio ? (
                  <p className="mt-3 text-sm leading-relaxed text-main-600">
                    {activeMember.bio}
                  </p>
                ) : null}

                {activeExpertise.length ? (
                  <div className="mt-6">
                    <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-main-500">
                      {labels.expertiseTitle}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {activeExpertise.map((item, index) => (
                        <li
                          key={`${activeMember.name}-exp-${index}`}
                          className="text-sm text-main-700"
                        >
                          - {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <p className="mt-6 text-sm text-main-600">{labels.consultationText}</p>
                <a
                  href={whatsappLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => {
                    if (!whatsappLink) event.preventDefault();
                  }}
                  className="mt-3 inline-flex items-center rounded-xl bg-gradient-to-r from-copper-600 to-copper-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:from-copper-700 hover:to-copper-600"
                >
                  <>
                    <i className="fa-brands fa-whatsapp mr-2" aria-hidden="true"></i>
                    {labels.contactButtonLabel}
                  </>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
