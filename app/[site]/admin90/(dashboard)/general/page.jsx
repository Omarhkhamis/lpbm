import { notFound } from "next/navigation";

import { getGeneralSettings } from "@lib/generalSettings";
import { normalizeSite } from "@lib/sites";
import { updateGeneralSettingsAction } from "../actions";
import SaveToast from "../components/SaveToast";
import FieldInput from "../components/FieldInput";

export default async function GeneralSettingsPage({ params }) {
  const site = normalizeSite(params?.site);
  if (!site) {
    notFound();
  }
  const settings = await getGeneralSettings(site);
  const action = updateGeneralSettingsAction.bind(null, site);

  return (
    <div className="space-y-6">
      <SaveToast successMessage="Settings saved" errorMessage="Failed to save settings" />
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          General
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Contact & Social
        </h2>
      </div>

      <form action={action} className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Lead Handling
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Form Recipient Email
              </label>
              <input
                name="formRecipientEmail"
                type="email"
                defaultValue={settings.formRecipientEmail || ""}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                WhatsApp Buttons Link
              </label>
              <input
                name="whatsappLink"
                defaultValue={settings.whatsappLink || ""}
                placeholder="https://wa.me/905xxxxxxxxx?text=..."
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
              />
              <p className="mt-1 text-xs text-slate-500">
                All WhatsApp/contact buttons will use this link.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Consultation Popup
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Open After (Seconds)
              </label>
              <input
                name="consultationDelaySeconds"
                type="number"
                min="0"
                defaultValue={settings.consultationDelaySeconds ?? 10}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Brand Assets
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FieldInput
              name="logoUrl"
              label="Logo"
              defaultValue={settings.logoUrl || ""}
            />
            <FieldInput
              name="faviconUrl"
              label="Favicon"
              defaultValue={settings.faviconUrl || ""}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Paste an image URL or upload a new file. PNG/SVG recommended for logo, ICO/PNG for favicon.
          </p>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-copper-600 to-copper-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:from-copper-700 hover:to-copper-500"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
