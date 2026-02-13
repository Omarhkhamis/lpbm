"use client";

import { useEffect, useRef, useState } from "react";

import { certificatesGalleryDefaults } from "../../../../../../lib/sectionDefaults";

export default function CertificatesGallery({ data }) {
  const content = data || certificatesGalleryDefaults;
  const items = Array.isArray(content.items) ? content.items : [];
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const node = sliderRef.current;
    if (!node) return undefined;

    const updateScrollState = () => {
      const maxScrollLeft = node.scrollWidth - node.clientWidth;
      const overflow = maxScrollLeft > 1;
      setCanScrollLeft(overflow && node.scrollLeft > 2);
      setCanScrollRight(overflow && node.scrollLeft < maxScrollLeft - 2);
    };
    updateScrollState();

    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateScrollState();
      });
      resizeObserver.observe(node);
    }

    const frameId = requestAnimationFrame(updateScrollState);
    return () => {
      cancelAnimationFrame(frameId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollState);
      node.removeEventListener("scroll", updateScrollState);
    };
  }, [items.length]);

  const scrollByOne = (direction) => {
    const node = sliderRef.current;
    if (!node) return;
    const firstCard = node.querySelector("[data-certificate-card='1']");
    const gap = Number.parseFloat(window.getComputedStyle(node).columnGap || "0");
    const amount = firstCard
      ? firstCard.getBoundingClientRect().width + gap
      : node.clientWidth * 0.8;
    node.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section id="certificates-gallery" className="relative overflow-hidden bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-10">
        <div className="mb-8 max-w-3xl">
          <p className="text-[11px] font-medium tracking-[0.34em] uppercase text-main-400">
            {content.kicker}
          </p>
          <h2 className="mt-3 text-4xl lg:text-5xl font-extralight tracking-tight text-main-900">
            {content.title}
          </h2>
          <p className="mt-3 text-sm sm:text-[15px] font-light text-main-600">
            {content.description}
          </p>
        </div>

        {canScrollLeft || canScrollRight ? (
          <div className="mb-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => scrollByOne(-1)}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-main-300 text-main-700 transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollByOne(1)}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-main-300 text-main-700 transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </button>
          </div>
        ) : null}

        <div ref={sliderRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {items.map((item, index) => (
            <div
              key={`${item.image || "certificate"}-${index}`}
              data-certificate-card="1"
              className="w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] shrink-0"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.alt || "Certificate"}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
