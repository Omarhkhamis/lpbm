"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { DEFAULT_POPUP_FORM_SETTINGS } from "../../lib/popupFormDefaults";
import { normalizeSite } from "../../lib/sites";

const MODAL_CANCEL_ID = "whatsapp-consultation-modal-cancel";
const MODAL_CONFIRM_ID = "whatsapp-consultation-modal-confirm";

const isWhatsappHost = (host) => {
  const normalized = String(host || "").toLowerCase();
  return (
    normalized === "wa.me" ||
    normalized.endsWith(".wa.me") ||
    normalized.includes("whatsapp.com")
  );
};

const resolveTarget = (target) => {
  const normalized = String(target || "").trim();
  return normalized || "_blank";
};

const resolveSite = (pathname, searchParams) => {
  const querySite = normalizeSite(searchParams?.get("site"));
  if (querySite) return querySite;
  if (String(pathname || "").startsWith("/dental-implant")) {
    return "dental-implant";
  }
  if (String(pathname || "").startsWith("/hollywood-smile")) {
    return "hollywood-smile";
  }
  return "hollywood-smile";
};

const applyWhatsappMessage = (href, text) => {
  const link = String(href || "").trim();
  const message = String(text || "").trim();
  if (!link || !message) return link;

  try {
    const url = new URL(link);
    if (!isWhatsappHost(url.hostname)) return link;
    url.searchParams.set("text", message);
    return url.toString();
  } catch {
    return link;
  }
};

export default function WhatsAppIntentModal() {
  const [activeLink, setActiveLink] = useState(null);
  const [popupSettings, setPopupSettings] = useState(
    DEFAULT_POPUP_FORM_SETTINGS
  );
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const site = useMemo(
    () => resolveSite(pathname, searchParams),
    [pathname, searchParams]
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadPopupSettings = async () => {
      try {
        const response = await fetch(
          `/api/popup-form-settings?site=${encodeURIComponent(site)}`,
          {
            cache: "no-store",
            signal: controller.signal
          }
        );
        if (!response.ok) return;
        const data = await response.json();
        setPopupSettings({
          ...DEFAULT_POPUP_FORM_SETTINGS,
          ...(data || {})
        });
      } catch (error) {
        if (error?.name !== "AbortError") {
          setPopupSettings(DEFAULT_POPUP_FORM_SETTINGS);
        }
      }
    };

    loadPopupSettings();

    return () => controller.abort();
  }, [site]);

  useEffect(() => {
    const store = window.__WHATSAPP_INTENT_MODAL__;
    if (!store) return undefined;

    const openIntentModal = (linkData) => {
      if (!linkData?.href) return;
      setActiveLink({
        href: String(linkData.href),
        target: resolveTarget(linkData.target)
      });
    };

    store.listener = openIntentModal;

    if (typeof store.consumePending === "function") {
      const pendingLink = store.consumePending();
      if (pendingLink?.href) {
        openIntentModal(pendingLink);
      }
    }

    return () => {
      if (store.listener === openIntentModal) {
        store.listener = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!activeLink) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveLink(null);
      }
    };

    document.body.classList.add("overflow-hidden");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeLink]);

  const handleContinue = () => {
    if (!activeLink?.href) return;
    const finalHref = applyWhatsappMessage(
      activeLink.href,
      popupSettings.popupWhatsappMessage
    );

    if (activeLink.target === "_self") {
      window.location.assign(finalHref);
    } else {
      window.open(finalHref, activeLink.target, "noopener,noreferrer");
    }

    setActiveLink(null);
  };
  const modalCopy = {
    eyebrow: "WhatsApp Consultation",
    title: popupSettings.popupFormTitle,
    body: popupSettings.popupFormBody,
    cancel: "No, close the form",
    confirm: "Yes, I would like to continue"
  };

  if (!activeLink) return null;

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center px-4 py-6"
      aria-hidden={false}
    >
      <button
        type="button"
        className="absolute inset-0 bg-main-950/72 backdrop-blur-[6px]"
        onClick={() => setActiveLink(null)}
        aria-label="Close WhatsApp confirmation"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="whatsapp-consultation-modal-title"
        className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(7,16,24,0.98),rgba(15,25,34,0.95))] text-white shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
      >
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-0 h-52 w-52 rounded-full bg-copper-500/18 blur-3xl" />
          <div className="absolute -right-12 bottom-0 h-56 w-56 rounded-full bg-emerald-500/12 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_42%)]" />
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center rounded-full border border-copper-300/20 bg-white/6 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-copper-100/80">
                {modalCopy.eyebrow}
              </span>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/75 transition hover:bg-white/10 hover:text-white"
              onClick={() => setActiveLink(null)}
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark text-sm" aria-hidden="true"></i>
            </button>
          </div>

          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(34,197,94,0.28),rgba(184,115,51,0.28))] shadow-[0_14px_40px_rgba(0,0,0,0.25)]">
              <i className="fa-brands fa-whatsapp text-2xl text-white" aria-hidden="true"></i>
            </div>

            <div className="space-y-3">
              <h2
                id="whatsapp-consultation-modal-title"
                className="text-xl font-light leading-relaxed text-white sm:text-2xl"
              >
                {modalCopy.title}
              </h2>
              <p className="max-w-lg text-sm leading-7 text-main-100/78 sm:text-[15px]">
                {modalCopy.body}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              id={MODAL_CANCEL_ID}
              type="button"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-red-400/35 bg-red-500/12 px-5 py-3 text-sm font-medium text-red-100 transition hover:bg-red-500/18 hover:border-red-300/40"
              onClick={() => setActiveLink(null)}
            >
              {modalCopy.cancel}
            </button>

            <button
              id={MODAL_CONFIRM_ID}
              type="button"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#16a34a,#22c55e)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(34,197,94,0.28)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_55px_rgba(34,197,94,0.34)]"
              onClick={handleContinue}
            >
              {modalCopy.confirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
