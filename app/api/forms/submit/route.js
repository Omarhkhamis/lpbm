import nodemailer from "nodemailer";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { getGeneralSettings } from "../../../../lib/generalSettings";
import { prisma } from "../../../../lib/prisma";
import { normalizeSite } from "../../../../lib/sites";

const EMAIL_TO_FALLBACK = "bmturkiya@gmail.com";

const isBlank = (value) =>
  value == null || (typeof value === "string" && !value.trim());

const asString = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => asString(item)).filter(Boolean).join(", ");
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const toPlainObject = (data) => {
  if (!data || typeof data !== "object") return {};
  if (data instanceof Map) return Object.fromEntries(data.entries());
  return data;
};

const sanitizePayload = (payload) => {
  const raw = toPlainObject(payload);
  const cleaned = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!key) continue;
    const stringValue = asString(value).trim();
    if (!stringValue) continue;
    cleaned[key] = stringValue.slice(0, 4000);
  }
  return cleaned;
};

const normalizePhone = (value) => {
  const digits = String(value || "")
    .replace(/[^\d+]/g, "")
    .replace(/^0+/, "");
  if (!digits) return "";
  const cleaned = digits.replace(/\D/g, "").slice(0, 15);
  return cleaned ? `+${cleaned}` : "";
};

const isValidPhone = (value) => {
  const normalized = normalizePhone(value);
  if (!normalized) return false;
  const parsed = parsePhoneNumberFromString(normalized);
  if (!parsed) return false;
  return parsed.isValid();
};

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

const buildTextBody = (fields) => {
  const lines = [];
  const entries = Object.entries(fields);
  for (const [key, value] of entries) {
    lines.push(`${key}: ${value}`);
  }
  return lines.join("\n");
};

const toErrorMessage = (error) => {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error.slice(0, 500);
  const message = error?.message || String(error);
  return String(message).slice(0, 500);
};

const pickReplyTo = (fields) => {
  const candidates = [
    fields.email,
    fields.contactEmail,
    fields.userEmail,
    fields.replyTo
  ].filter(Boolean);
  const email = candidates.find((value) => /\S+@\S+\.\S+/.test(value));
  return email || undefined;
};

const pickFirstFilled = (fields, keys) => {
  for (const key of keys) {
    const value = asString(fields?.[key]).trim();
    if (value) return value;
  }
  return "";
};

const buildWhatsappText = (fields) => {
  const name = pickFirstFilled(fields, ["fullName", "name", "full_name"]);
  const prize = pickFirstFilled(fields, ["prize", "result", "spinPrize"]);
  const message = pickFirstFilled(fields, [
    "message",
    "comment",
    "notes",
    "details",
    "inquiry",
    "text"
  ]);
  const lines = [];
  if (name) lines.push(`Name: ${name}`);
  if (prize) lines.push(`Prize: ${prize}`);
  if (message) lines.push(`Message: ${message}`);
  return lines.join("\n");
};

const isWhatsappHost = (host) => {
  const normalized = String(host || "").toLowerCase();
  return (
    normalized === "wa.me" ||
    normalized.endsWith(".wa.me") ||
    normalized.includes("whatsapp.com")
  );
};

const buildWhatsappRedirect = (baseLink, fields) => {
  const base = String(baseLink || "").trim();
  if (!base) return "";

  const text = buildWhatsappText(fields);
  if (!text) return base;

  try {
    const url = new URL(base);
    if (!isWhatsappHost(url.hostname)) return base;
    const existingText = url.searchParams.get("text");
    url.searchParams.set(
      "text",
      existingText ? `${existingText}\n\n${text}` : text
    );
    return url.toString();
  } catch {
    return base;
  }
};

const pickFrom = () => {
  const candidates = [
    process.env.EMAIL_FROM,
    process.env.SMTP_USER,
    EMAIL_TO_FALLBACK
  ].filter(Boolean);
  return candidates.find(isValidEmail) || EMAIL_TO_FALLBACK;
};

const createTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 0);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

const detectSite = (page, site) => {
  const normalized = normalizeSite(site);
  if (normalized) return normalized;
  const path = String(page || "").toLowerCase();
  if (path.startsWith("/dental-implant")) return "dental-implant";
  if (path.startsWith("/hollywood-smile")) return "hollywood-smile";
  return "hollywood-smile";
};

export async function POST(request) {
  let payload = {};
  const contentType = request.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      const formData = await request.formData();
      payload = Object.fromEntries(formData.entries());
    }
  } catch {
    payload = {};
  }

  const cleaned = sanitizePayload(payload);

  if (!isBlank(cleaned.company)) {
    return Response.json({ ok: true, skipped: true });
  }

  if (cleaned.phone && !isValidPhone(cleaned.phone)) {
    return Response.json(
      { ok: false, error: "INVALID_PHONE" },
      { status: 400 }
    );
  }

  if (cleaned.email && !isValidEmail(cleaned.email)) {
    return Response.json(
      { ok: false, error: "INVALID_EMAIL" },
      { status: 400 }
    );
  }

  const site = detectSite(cleaned.page, cleaned.site);
  const locale =
    String(cleaned.locale || "").toLowerCase() === "ru" ? "ru" : "en";
  const source = cleaned.source || "website";
  const isSpin = source === "lucky-spin" || Boolean(cleaned.prize);
  const subject = `New form submission (${source})`;
  let settings = null;
  let settingsRecipient = "";
  try {
    settings = await getGeneralSettings(site);
    settingsRecipient = settings?.formRecipientEmail || "";
  } catch {
    settings = null;
    settingsRecipient = "";
  }

  const to = settingsRecipient || process.env.EMAIL_TO || EMAIL_TO_FALLBACK;
  const from = pickFrom();
  const replyTo = pickReplyTo(cleaned);

  const baseFields = {
    source,
    site,
    page: cleaned.page || "",
    submittedAt: new Date().toISOString()
  };

  const messageBody = buildTextBody({
    ...baseFields,
    ...cleaned
  });
  let formSubmissionId = null;
  let emailDelivery = {
    attempted: false,
    sent: false,
    status: "pending"
  };

  // Save spin submissions separately and do it early so email failures don't block storage.
  if (cleaned.fullName && cleaned.phone && cleaned.prize) {
    try {
      await prisma.spinData.create({
        data: {
          fullName: cleaned.fullName,
          phone: cleaned.phone,
          prize: cleaned.prize,
          site
        }
      });
    } catch (error) {
      // Ignore storage errors for spin data.
    }
  }

  if (!isSpin) {
    try {
      const submission = await prisma.formSubmission.create({
        data: {
          source,
          page: cleaned.page || null,
          site,
          payload: {
            ...cleaned,
            submittedAt: baseFields.submittedAt,
            emailDelivery
          }
        }
      });
      formSubmissionId = submission.id;
    } catch (error) {
      // Don't block the response if storage fails.
    }
  }

  const baseRedirect =
    settings?.whatsappLink ||
    cleaned.redirectTo ||
    "https://wa.me/+905382112583";
  const redirectTo = buildWhatsappRedirect(baseRedirect, cleaned) || baseRedirect;
  const transport = createTransport();
  if (transport) {
    try {
      const info = await transport.sendMail({
        to,
        from,
        subject,
        text: messageBody,
        ...(replyTo ? { replyTo } : {})
      });
      emailDelivery = {
        attempted: true,
        sent: true,
        status: "sent",
        to,
        from,
        messageId: info?.messageId || null
      };
    } catch (error) {
      emailDelivery = {
        attempted: true,
        sent: false,
        status: "failed",
        to,
        from,
        error: toErrorMessage(error)
      };
      // Log and continue so submissions are not blocked by email failures.
      console.error("Email delivery failed for form submission:", error);
    }
  } else {
    emailDelivery = {
      attempted: false,
      sent: false,
      status: "skipped",
      to,
      from,
      error: "SMTP_NOT_CONFIGURED"
    };
  }

  if (!isSpin && formSubmissionId) {
    try {
      await prisma.formSubmission.update({
        where: { id: formSubmissionId },
        data: {
          payload: {
            ...cleaned,
            submittedAt: baseFields.submittedAt,
            emailDelivery
          }
        }
      });
    } catch {
      // Keep response successful even if post-send metadata update fails.
    }
  }

  return Response.json({ ok: true, redirectTo });
}
