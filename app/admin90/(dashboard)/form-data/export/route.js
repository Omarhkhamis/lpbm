import { prisma } from "@lib/prisma";
import { normalizeSite } from "@lib/sites";

const normalizeDate = (value, fallback) => {
  const date = value ? new Date(value) : null;
  return Number.isNaN(date?.getTime()) ? fallback : date;
};

const buildDateRange = (month, from, to) => {
  if (month) {
    const [year, monthIndex] = month.split("-").map(Number);
    if (!Number.isNaN(year) && !Number.isNaN(monthIndex)) {
      const start = new Date(year, monthIndex - 1, 1, 0, 0, 0, 0);
      const end = new Date(year, monthIndex, 1, 0, 0, 0, 0);
      return { gte: start, lt: end };
    }
  }

  const start = normalizeDate(from, null);
  const endRaw = normalizeDate(to, null);
  if (endRaw) {
    endRaw.setHours(23, 59, 59, 999);
  }

  if (start || endRaw) {
    return {
      ...(start ? { gte: start } : {}),
      ...(endRaw ? { lte: endRaw } : {})
    };
  }

  return null;
};

const pickValue = (payload, keys) => {
  if (!payload) return "";
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

const getEmailDelivery = (payload) => {
  if (!payload || typeof payload !== "object") {
    return { status: "", error: "" };
  }
  const info = payload.emailDelivery;
  if (!info || typeof info !== "object" || Array.isArray(info)) {
    return { status: "", error: "" };
  }
  const status =
    typeof info.status === "string" && info.status.trim()
      ? info.status.trim().toLowerCase()
      : "";
  const error = typeof info.error === "string" ? info.error.trim() : "";
  return { status, error };
};

const escapeCsv = (value) => {
  if (value == null) return "";
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const site = normalizeSite(searchParams.get("site"));
  if (!site) {
    return new Response("Not found", { status: 404 });
  }
  const order = searchParams.get("order") === "oldest" ? "asc" : "desc";
  const month = searchParams.get("month") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const createdAt = buildDateRange(month, from, to);
  const where = {
    ...(createdAt ? { createdAt } : {}),
    site
  };

  const records = await prisma.formSubmission.findMany({
    where,
    orderBy: { createdAt: order }
  });

  const header = [
    "id",
    "source",
    "formName",
    "page",
    "fullName",
    "email",
    "emailStatus",
    "emailError",
    "phone",
    "message",
    "createdAt"
  ];

  const rows = records.map((record) => {
    const payload =
      typeof record.payload === "object" && record.payload ? record.payload : {};
    const fullName = pickValue(payload, ["fullName", "name"]);
    const email = pickValue(payload, ["email"]);
    const emailDelivery = getEmailDelivery(payload);
    const phone = pickValue(payload, ["phone"]);
    const message = pickValue(payload, ["message"]);
    const formName = pickValue(payload, [
      "formName",
      "form_name",
      "formLabel",
      "form_label"
    ]);
    return [
      escapeCsv(record.id),
      escapeCsv(record.source || payload.source || "form"),
      escapeCsv(formName),
      escapeCsv(record.page || payload.page || ""),
      escapeCsv(fullName),
      escapeCsv(email),
      escapeCsv(emailDelivery.status || ""),
      escapeCsv(emailDelivery.error || ""),
      escapeCsv(phone),
      escapeCsv(message),
      escapeCsv(record.createdAt?.toISOString?.() || "")
    ].join(",");
  });

  const csv = [header.join(","), ...rows].join("\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="form-submissions.csv"'
    }
  });
}
