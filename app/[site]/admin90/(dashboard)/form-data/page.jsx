import { notFound } from "next/navigation";

import { prisma } from "@lib/prisma";
import { normalizeSite } from "@lib/sites";

const formatDate = (value) => {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(value);
  } catch (error) {
    return value?.toISOString?.() ?? "";
  }
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
    return { status: "legacy", error: "" };
  }
  const info = payload.emailDelivery;
  if (!info || typeof info !== "object" || Array.isArray(info)) {
    return { status: "legacy", error: "" };
  }
  const status =
    typeof info.status === "string" && info.status.trim()
      ? info.status.trim().toLowerCase()
      : "pending";
  const error = typeof info.error === "string" ? info.error.trim() : "";
  return { status, error };
};

const getEmailStatusClasses = (status) => {
  if (status === "sent") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  }
  if (status === "failed") {
    return "bg-rose-50 text-rose-700 ring-rose-600/20";
  }
  if (status === "skipped") {
    return "bg-amber-50 text-amber-700 ring-amber-600/20";
  }
  if (status === "pending") {
    return "bg-slate-100 text-slate-700 ring-slate-600/20";
  }
  return "bg-slate-50 text-slate-500 ring-slate-600/20";
};

const getEmailStatusLabel = (status) => {
  if (status === "sent") return "Sent";
  if (status === "failed") return "Failed";
  if (status === "skipped") return "Skipped";
  if (status === "pending") return "Pending";
  return "N/A";
};

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

export default async function FormDataPage({ searchParams, params }) {
  const site = normalizeSite(params?.site);
  if (!site) {
    notFound();
  }
  const order = searchParams?.order === "oldest" ? "asc" : "desc";
  const month = typeof searchParams?.month === "string" ? searchParams.month : "";
  const from = typeof searchParams?.from === "string" ? searchParams.from : "";
  const to = typeof searchParams?.to === "string" ? searchParams.to : "";
  const createdAt = buildDateRange(month, from, to);
  const where = {
    ...(createdAt ? { createdAt } : {}),
    site
  };

  const records = await prisma.formSubmission.findMany({
    where,
    orderBy: { createdAt: order }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Form Data
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            Submissions
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Total records: {records.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/${site}/admin90/form-data/export?${new URLSearchParams({
              order: order === "asc" ? "oldest" : "newest",
              month,
              from,
              to
            }).toString()}`}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:bg-slate-800"
          >
            Export CSV
          </a>
        </div>
      </div>

      <form
        method="get"
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Order
            </label>
            <select
              name="order"
              defaultValue={order === "asc" ? "oldest" : "newest"}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Month
            </label>
            <input
              name="month"
              type="month"
              defaultValue={month}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              From
            </label>
            <input
              name="from"
              type="date"
              defaultValue={from}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              To
            </label>
            <input
              name="to"
              type="date"
              defaultValue={to}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          <a
            href={`/${site}/admin90/form-data`}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Reset
          </a>
          <button
            type="submit"
            className="rounded-lg bg-copper-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:bg-copper-700"
          >
            Apply
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {records.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-500">
            No form submissions yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-6 py-4">Form</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Email Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record) => {
                  const payload =
                    typeof record.payload === "object" && record.payload
                      ? record.payload
                      : {};
                  const name = pickValue(payload, ["fullName", "name"]);
                  const email = pickValue(payload, ["email"]);
                  const phone = pickValue(payload, ["phone"]);
                  const source = record.source || payload.source || "form";
                  const formName = pickValue(payload, [
                    "formName",
                    "form_name",
                    "formLabel",
                    "form_label"
                  ]);
                  const message = pickValue(payload, ["message"]);
                  const emailDelivery = getEmailDelivery(payload);

                  return (
                    <tr key={record.id} className="text-slate-700 align-top">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {formName || source}
                      </td>
                      <td className="px-6 py-4">{name || "—"}</td>
                      <td className="px-6 py-4">{email || "—"}</td>
                      <td className="px-6 py-4">{phone || "—"}</td>
                      <td className="px-6 py-4">
                        {formatDate(record.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        {message ? (
                          <p className="max-w-sm whitespace-pre-wrap text-[13px] text-slate-700">
                            {message}
                          </p>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ring-1 ring-inset ${getEmailStatusClasses(
                            emailDelivery.status
                          )}`}
                        >
                          {getEmailStatusLabel(emailDelivery.status)}
                        </span>
                        {emailDelivery.status === "failed" && emailDelivery.error ? (
                          <p className="mt-1 max-w-[220px] truncate text-[11px] text-rose-600">
                            {emailDelivery.error}
                          </p>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
