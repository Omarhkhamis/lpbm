"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const STORAGE_PREFIX = "spinRedirect:";

export default function SpinRedirectPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const storageKey = useMemo(
    () => (token ? `${STORAGE_PREFIX}${token}` : ""),
    [token]
  );
  const [status, setStatus] = useState("waiting");
  const [targetUrl, setTargetUrl] = useState("");

  useEffect(() => {
    if (!storageKey) {
      setStatus("missing");
      return undefined;
    }
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const url = window.localStorage.getItem(storageKey);
      if (url) {
        window.localStorage.removeItem(storageKey);
        setTargetUrl(url);
        setStatus("redirecting");
        window.location.assign(url);
        window.clearInterval(timer);
      } else if (attempts > 80) {
        setStatus("timeout");
        window.clearInterval(timer);
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, [storageKey]);

  return (
    <main className="min-h-screen bg-main-950 text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <div className="mx-auto h-12 w-12 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
        {status === "missing" ? (
          <p className="text-sm text-white/70">Missing redirect token.</p>
        ) : status === "timeout" ? (
          <>
            <p className="text-sm text-white/70">
              Waiting took too long. You can still open WhatsApp manually.
            </p>
            {targetUrl ? (
              <a
                href={targetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-copper-600 px-4 py-2 text-sm font-medium text-white"
              >
                Open WhatsApp
              </a>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-white/70">Preparing WhatsApp...</p>
        )}
      </div>
    </main>
  );
}
