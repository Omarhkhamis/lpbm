"use client";

import { useEffect } from "react";

const UTILS_URL =
  "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/js/utils.js";

const waitForIntlTelInput = () => {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.intlTelInput) return Promise.resolve(window.intlTelInput);

  return new Promise((resolve) => {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (window.intlTelInput) {
        clearInterval(timer);
        resolve(window.intlTelInput);
        return;
      }
      if (tries > 80) {
        clearInterval(timer);
        resolve(null);
      }
    }, 100);
  });
};

const getIntlInstance = (input) => {
  try {
    return window.intlTelInputGlobals?.getInstance?.(input) || null;
  } catch {
    return null;
  }
};

const enforceE164 = (value) => {
  let cleaned = String(value || "").replace(/[^\d+]/g, "");
  if (!cleaned.startsWith("+")) cleaned = "+" + cleaned.replace(/\+/g, "");
  const digits = cleaned.replace(/\D/g, "").slice(0, 15);
  return "+" + digits;
};

const sanitizePhoneInput = (value) => {
  const cleaned = String(value || "").replace(/[^\d+]/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("+")) {
    return "+" + cleaned.slice(1).replace(/\+/g, "");
  }
  return cleaned.replace(/\+/g, "");
};

export default function DentalImplantEffects() {
  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    const bound = new WeakSet();
    const shouldDebug =
      typeof window !== "undefined" &&
      window.localStorage &&
      window.localStorage.getItem("iti-debug") === "1";
    const debugLog = (...args) => {
      if (!shouldDebug) return;
      console.log("[iti]", ...args);
    };
    debugLog("effects:mounted");

    const initOne = (input, { force = false } = {}) => {
      debugLog("initOne:start", {
        id: input?.id,
        force,
        hasIntl: Boolean(window.intlTelInput)
      });
      if (!window.intlTelInput) return;
      if (!input || input.type !== "tel") return;
      if (!input.id) return;

      const hidden = document.getElementById(`${input.id}_hidden`);
      debugLog("initOne:hidden", { found: Boolean(hidden) });
      if (!hidden) return;

      const wrapper = input.closest("[data-iti]");
      debugLog("initOne:wrapper", { found: Boolean(wrapper) });
      if (!wrapper) return;

      const existing = getIntlInstance(input);
      debugLog("initOne:instance", {
        id: input.id,
        mounted: input.dataset.itiMounted,
        hasInstance: Boolean(existing)
      });
      if (force && existing) {
        try {
          existing.destroy();
        } catch {
          return;
        }
      }

      const stillThere = getIntlInstance(input);
      debugLog("initOne:instanceCheck", {
        id: input.id,
        hasInstance: Boolean(stillThere)
      });
      if (!force && input.dataset.itiMounted === "1" && stillThere) return;

      if (input.dataset.itiMounted === "1" && !stillThere) {
        delete input.dataset.itiMounted;
      }

      if (getComputedStyle(wrapper).position === "static") {
        wrapper.style.position = "relative";
      }

      wrapper.style.overflow = "visible";

      const dialog = input.closest('[role="dialog"]');
      const dropdownContainer = dialog || document.body;

      const iti = window.intlTelInput(input, {
        initialCountry: "auto",
        geoIpLookup: (callback) => {
          fetch("https://ipapi.co/json/")
            .then((response) => response.json())
            .then((data) => callback(String(data?.country_code || "tr").toLowerCase()))
            .catch(() => callback("tr"));
        },
        allowDropdown: true,
        nationalMode: false,
        separateDialCode: false,
        autoHideDialCode: false,
        formatOnDisplay: true,
        autoPlaceholder: "polite",
        dropdownContainer,
        utilsScript: UTILS_URL
      });
      debugLog("initOne:created", {
        id: input.id,
        hasInstance: Boolean(iti),
        hasOpenDropdown: typeof iti?.openDropdown === "function"
      });


      input.dataset.itiMounted = "1";

      let prevDial = iti.getSelectedCountryData()?.dialCode || "";

      const syncHidden = () => {
        let e164 = "";
        try {
          e164 = iti.getNumber();
        } catch {
          e164 = "";
        }
        if (!e164 || !String(e164).startsWith("+")) {
          e164 = enforceE164(input.value);
        }
        hidden.value = e164;
        hidden.dispatchEvent(new Event("input", { bubbles: true }));
        hidden.dispatchEvent(new Event("change", { bubbles: true }));
      };

      const applyPrefixIfEmpty = () => {
        if (String(input.value || "").trim()) return;
        const data = iti.getSelectedCountryData();
        if (!data?.dialCode) return;
        input.value = `+${data.dialCode}`;
        prevDial = String(data.dialCode || "");
        syncHidden();
      };

      const replacePrefixOnCountryChange = () => {
        const data = iti.getSelectedCountryData();
        const newDial = String(data.dialCode || "");
        const newPrefix = `+${newDial}`;

        const value = String(input.value || "").trim();
        if (!value) {
          input.value = newPrefix;
          prevDial = newDial;
          syncHidden();
          return;
        }

        if (!value.startsWith("+")) {
          prevDial = newDial;
          return;
        }

        const oldPrefix = prevDial ? `+${prevDial}` : null;
        if (oldPrefix && value.startsWith(oldPrefix)) {
          const rest = value.slice(oldPrefix.length).replace(/\D/g, "");
          input.value = newPrefix + rest;
          prevDial = newDial;
          syncHidden();
        } else {
          prevDial = newDial;
        }
      };

      const start = Date.now();
      const timer = setInterval(() => {
        applyPrefixIfEmpty();
        if (String(input.value || "").trim() || Date.now() - start > 8000) {
          clearInterval(timer);
        }
      }, 100);

      if (!bound.has(input)) {
        input.addEventListener("input", () => {
          const sanitized = sanitizePhoneInput(input.value);
          if (sanitized !== input.value) {
            input.value = sanitized;
          }
          syncHidden();
        });
        input.addEventListener("blur", () => {
          applyPrefixIfEmpty();
          syncHidden();
        });
        input.addEventListener("countrychange", () => {
          if (!String(input.value || "").trim()) {
            applyPrefixIfEmpty();
          } else {
            replacePrefixOnCountryChange();
          }
        });
        bound.add(input);
      }

      applyPrefixIfEmpty();
      syncHidden();
    };

    const initAll = async (force = false) => {
      const iti = await waitForIntlTelInput();
      if (!iti || cancelled) return;
      document
        .querySelectorAll('[data-iti] input[type="tel"]')
        .forEach((input) => initOne(input, { force }));
    };

    const scheduleInit = (force = false) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setTimeout(() => initAll(force), 0));
    };

    const handleFocusIn = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.type !== "tel") return;
      debugLog("focusin", { id: target.id });
      const wrapper = target.closest("[data-iti]");
      if (!wrapper) return;
      if (!window.intlTelInput) {
        waitForIntlTelInput().then(() => initOne(target, { force: true }));
        return;
      }
      initOne(target, { force: false });
    };

    const handlePointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const wrapper = target.closest("[data-iti]");
      if (!wrapper) return;
      const input = wrapper.querySelector('input[type="tel"]');
      if (!input) return;
      const flagContainer = wrapper.querySelector(".iti__flag-container");
      const onFlag =
        Boolean(
          target.closest(".iti__flag-container, .iti__selected-flag, .iti__arrow")
        ) || Boolean(flagContainer?.contains(target));
      debugLog("pointerdown", {
        id: input.id,
        onFlag
      });
      if (onFlag) {
        event.preventDefault();
        input.focus();
      }
      if (!window.intlTelInput) {
        waitForIntlTelInput().then(() => {
          initOne(input, { force: true });
          const iti = getIntlInstance(input);
          if (iti && typeof iti.openDropdown === "function" && onFlag) {
            requestAnimationFrame(() => {
              input.focus();
              iti.openDropdown();
            });
          }
        });
        return;
      }
      initOne(input, { force: false });
      let iti = getIntlInstance(input);
      if (!iti) {
        initOne(input, { force: true });
        iti = getIntlInstance(input);
      }
      if (iti && typeof iti.openDropdown === "function" && onFlag) {
        requestAnimationFrame(() => {
          input.focus();
          iti.openDropdown();
        });
      }
    };

    scheduleInit(false);

    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.addedNodes.length)) {
        scheduleInit(false);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const handlePageShow = () => scheduleInit(true);
    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, []);

  return null;
}
