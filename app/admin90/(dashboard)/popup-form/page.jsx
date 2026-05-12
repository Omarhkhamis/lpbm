import { getGeneralSettings } from "@lib/generalSettings";
import { getDefaultPopupFormSettings } from "@lib/popupFormDefaults";
import { normalizeSite } from "@lib/sites";
import { updatePopupFormSettingsAction } from "../actions";
import AdminShell from "../AdminShell";
import SaveToast from "../components/SaveToast";

export default async function PopupFormSettingsPage({ searchParams }) {
  const site = normalizeSite(searchParams?.site) || "hollywood-smile";
  const settings = await getGeneralSettings(site);
  const action = updatePopupFormSettingsAction.bind(null, site);
  const popupLocales = [
    {
      code: "en",
      label: "English",
      suffix: "En",
      defaults: getDefaultPopupFormSettings("en")
    },
    {
      code: "ru",
      label: "Russian",
      suffix: "Ru",
      defaults: getDefaultPopupFormSettings("ru")
    }
  ];
  const getPopupValue = (field, item) =>
    settings[`${field}${item.suffix}`] ||
    (item.code === "en" ? settings[field] : "") ||
    item.defaults[field];

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
          {popupLocales.map((item) => (
            <div
              key={item.code}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                {item.label} Popup
              </p>

              <div className="mt-4 grid gap-4">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Popup Title
                  </label>
                  <textarea
                    name={`popupFormTitle${item.suffix}`}
                    rows="4"
                    defaultValue={getPopupValue("popupFormTitle", item)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Popup Description
                  </label>
                  <textarea
                    name={`popupFormBody${item.suffix}`}
                    rows="3"
                    defaultValue={getPopupValue("popupFormBody", item)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Message Inserted Into WhatsApp
                  </label>
                  <textarea
                    name={`popupWhatsappMessage${item.suffix}`}
                    rows="6"
                    defaultValue={getPopupValue("popupWhatsappMessage", item)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    This text will replace the <code>text=</code> part in the
                    WhatsApp link for {item.label.toLowerCase()} pages.
                  </p>
                </div>
              </div>
            </div>
          ))}

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
