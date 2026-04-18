import "./globals.css";
import { Suspense } from "react";
import Script from "next/script";
import WhatsAppIntentModal from "./components/WhatsAppIntentModal";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
        <Script id="whatsapp-intent-boot" strategy="beforeInteractive">
          {`
            (function () {
              function isWhatsappHost(host) {
                var normalized = String(host || "").toLowerCase();
                return normalized === "wa.me" ||
                  normalized.endsWith(".wa.me") ||
                  normalized.indexOf("whatsapp.com") !== -1;
              }

              function resolveTarget(target) {
                var normalized = String(target || "").trim();
                return normalized || "_blank";
              }

              var store = window.__WHATSAPP_INTENT_MODAL__ || {
                listener: null,
                pendingLink: null,
                open: function (linkData) {
                  if (typeof this.listener === "function") {
                    this.listener(linkData);
                    return;
                  }
                  this.pendingLink = linkData;
                },
                consumePending: function () {
                  var value = this.pendingLink;
                  this.pendingLink = null;
                  return value;
                }
              };

              window.__WHATSAPP_INTENT_MODAL__ = store;

              document.addEventListener("click", function (event) {
                if (window.location.pathname.indexOf("/admin90") !== -1) return;
                if (event.defaultPrevented) return;
                if (event.button && event.button !== 0) return;
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

                var target = event.target;
                var anchor = target instanceof Element ? target.closest("a[href]") : null;
                if (anchor) {
                  if (anchor.dataset.whatsappModal === "skip") return;
                  if (anchor.closest("form")) return;

                  var href = String(anchor.getAttribute("href") || "").trim();
                  if (!href || href === "#") return;

                  var url;
                  try {
                    url = new URL(anchor.href);
                  } catch (error) {
                    return;
                  }

                  if (!isWhatsappHost(url.hostname)) return;

                  event.preventDefault();
                  store.open({
                    href: url.toString(),
                    target: resolveTarget(anchor.getAttribute("target")),
                    source: String(anchor.dataset.whatsappSource || "").trim()
                  });
                  return;
                }

                var button = target instanceof Element ? target.closest("button[data-whatsapp-trigger]") : null;
                if (!button) return;
                if (button.dataset.whatsappModal === "skip") return;
                if (button.closest("form")) return;
                if (button.disabled) return;

                var buttonHref = String(button.dataset.whatsappHref || "").trim();
                if (!buttonHref || buttonHref === "#") return;

                event.preventDefault();
                store.open({
                  href: buttonHref,
                  target: resolveTarget(button.dataset.whatsappTarget),
                  source: String(button.dataset.whatsappSource || "").trim()
                });
              }, true);
            })();
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
        <Suspense fallback={null}>
          <WhatsAppIntentModal />
        </Suspense>
      </body>
    </html>
  );
}
