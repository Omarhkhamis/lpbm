import { notFound } from "next/navigation";

import { getFooterSettings } from "@lib/footerSettings";
import { normalizeLocale, normalizeSite } from "@lib/sites";
import { updateFooterSettingsAction } from "../actions";
import FieldInput from "../components/FieldInput";
import SaveToast from "../components/SaveToast";

export default async function FooterSettingsPage({ params, searchParams }) {
  const site = normalizeSite(params?.site);
  if (!site) {
    notFound();
  }
  const locale = normalizeLocale(searchParams?.locale);
  const settings = await getFooterSettings(site, locale);
  const action = updateFooterSettingsAction.bind(null, site);

  return (
    <div className="space-y-6">
      <SaveToast successMessage="Footer saved" errorMessage="Failed to save footer settings" />
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Footer
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Footer Content & Links
        </h2>
        <div className="mt-3 inline-flex rounded-lg border border-slate-200 bg-white p-1 text-xs font-semibold uppercase tracking-[0.2em]">
          <a
            href={`/${site}/admin90/footer?locale=en`}
            className={`px-3 py-1 rounded-md transition ${
              locale === "en"
                ? "bg-copper-50 border border-copper-200 text-copper-700"
                : "text-slate-600 hover:text-copper-700"
            }`}
          >
            EN
          </a>
          <a
            href={`/${site}/admin90/footer?locale=ru`}
            className={`px-3 py-1 rounded-md transition ${
              locale === "ru"
                ? "bg-copper-50 border border-copper-200 text-copper-700"
                : "text-slate-600 hover:text-copper-700"
            }`}
          >
            RU
          </a>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          You are editing: <span className="font-semibold">{locale.toUpperCase()}</span>
        </p>
      </div>

      <form action={action} className="space-y-6">
        <input type="hidden" name="locale" value={locale} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Main Text
          </p>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={settings.description || ""}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldInput
              name="footerLogoUrl"
              label="Footer Logo"
              defaultValue={settings.footerLogoUrl || ""}
            />
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Badge
              </label>
              <input
                name="badge"
                defaultValue={settings.badge || ""}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Note
              </label>
              <input
                name="note"
                defaultValue={settings.note || ""}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Footer Navigation
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="navTreatments" defaultValue={settings.navTreatments || ""} placeholder="Treatments" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="navPopularTreatments" defaultValue={settings.navPopularTreatments || ""} placeholder="Popular Treatments" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="navBeforeAfter" defaultValue={settings.navBeforeAfter || ""} placeholder="Before & After" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="navTestimonials" defaultValue={settings.navTestimonials || ""} placeholder="Testimonials" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="navFaqs" defaultValue={settings.navFaqs || ""} placeholder="FAQs" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="navHealthTourism" defaultValue={settings.navHealthTourism || ""} placeholder="Health Tourism" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Contact
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="phoneLabel" defaultValue={settings.phoneLabel || ""} placeholder="Phone label" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="phone" defaultValue={settings.phone || ""} placeholder="+90 ..." className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="whatsappLabel" defaultValue={settings.whatsappLabel || ""} placeholder="WhatsApp label" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="whatsappNumber" defaultValue={settings.whatsappNumber || ""} placeholder="+90 ..." className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="emailLabel" defaultValue={settings.emailLabel || ""} placeholder="E-mail label" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="email" defaultValue={settings.email || ""} placeholder="info@example.com" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="addressLabel" defaultValue={settings.addressLabel || ""} placeholder="Address label" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="whatsappLink" defaultValue={settings.whatsappLink || ""} placeholder="https://wa.me/...?...text=..." className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
          </div>
          <div>
            <textarea
              name="address"
              rows={3}
              defaultValue={settings.address || ""}
              placeholder="Address"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Social & Legal
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="instagram" defaultValue={settings.instagram || ""} placeholder="Instagram URL" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="facebook" defaultValue={settings.facebook || ""} placeholder="Facebook URL" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="youtube" defaultValue={settings.youtube || ""} placeholder="YouTube URL" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="copyright" defaultValue={settings.copyright || ""} placeholder="© 2025 BM TURKIYE. All Rights Reserved." className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="privacy" defaultValue={settings.privacy || ""} placeholder="Privacy Policy" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
            <input name="terms" defaultValue={settings.terms || ""} placeholder="Terms" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40" />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-copper-600 to-copper-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:from-copper-700 hover:to-copper-500"
          >
            Save Footer
          </button>
        </div>
      </form>
    </div>
  );
}
