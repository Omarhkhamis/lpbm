import { getGeneralSettings } from "@lib/generalSettings";
import { DEFAULT_POPUP_FORM_SETTINGS } from "@lib/popupFormDefaults";
import { normalizeSite } from "@lib/sites";
import { updatePopupFormSettingsAction } from "../actions";
import AdminShell from "../AdminShell";
import SaveToast from "../components/SaveToast";

export default async function PopupFormSettingsPage({ searchParams }) {
  const site = normalizeSite(searchParams?.site) || "hollywood-smile";
  const settings = await getGeneralSettings(site);
  const action = updatePopupFormSettingsAction.bind(null, site);

  return (
    <AdminShell site={site} locale={searchParams?.locale}>
      <div className="space-y-6">
        <SaveToast
          successMessage="Popup form saved"
          errorMessage="Failed to save popup form settings"
        />

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Settings
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            Popup Form
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage the WhatsApp confirmation popup text and the ready-made
            message that will be inserted into WhatsApp after the visitor clicks
            continue.
          </p>
        </div>

        <form action={action} className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Popup Content
            </p>

            <div className="mt-4 grid gap-4">
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Popup Title
                </label>
                <textarea
                  name="popupFormTitle"
                  rows="4"
                  defaultValue={
                    settings.popupFormTitle ||
                    DEFAULT_POPUP_FORM_SETTINGS.popupFormTitle
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Popup Description
                </label>
                <textarea
                  name="popupFormBody"
                  rows="3"
                  defaultValue={
                    settings.popupFormBody ||
                    DEFAULT_POPUP_FORM_SETTINGS.popupFormBody
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              WhatsApp Ready Message
            </p>

            <div className="mt-4">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Message Inserted Into WhatsApp
              </label>
              <textarea
                name="popupWhatsappMessage"
                rows="6"
                defaultValue={
                  settings.popupWhatsappMessage ||
                  DEFAULT_POPUP_FORM_SETTINGS.popupWhatsappMessage
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
              />
              <p className="mt-2 text-xs text-slate-500">
                This text will replace the <code>text=</code> part in the
                WhatsApp link after the visitor clicks the green continue
                button.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-copper-600 to-copper-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:from-copper-700 hover:to-copper-500"
            >
              Save Popup Form
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
