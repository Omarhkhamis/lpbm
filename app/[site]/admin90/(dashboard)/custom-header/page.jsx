import { notFound } from "next/navigation";

import { requireFullAdmin } from "@lib/adminAccess";
import { getCustomHeader } from "@lib/customHeader";
import { normalizeSite } from "@lib/sites";
import { updateCustomHeaderAction } from "../actions";
import FieldInput from "../components/FieldInput";
import SaveToast from "../components/SaveToast";

export default async function CustomHeaderPage({ params }) {
  const site = normalizeSite(params?.site);
  if (!site) {
    notFound();
  }
  await requireFullAdmin(site, { scoped: true });
  const customHeader = await getCustomHeader(site);
  const action = updateCustomHeaderAction.bind(null, site);

  return (
    <div className="space-y-6">
      <SaveToast successMessage="Custom header saved" errorMessage="Failed to save custom header" />
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Settings
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Custom Codes
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Inject custom code (e.g., Tag Manager) safely into the site head.
        </p>
      </div>

      <form action={action} className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Header Code
          </p>
          <div className="mt-4">
            <FieldInput
              name="customHeaderEn"
              label="Custom Header Snippet (English Only)"
              defaultValue={customHeader.contentEn || ""}
              isTextarea
            />
            <p className="mt-2 text-xs text-slate-500">
              This snippet is injected only on English pages.
            </p>
          </div>
          <div className="mt-8">
            <FieldInput
              name="customHeaderRu"
              label="Custom Header Snippet (Russian Only)"
              defaultValue={customHeader.contentRu || ""}
              isTextarea
            />
            <p className="mt-2 text-xs text-slate-500">
              This snippet is injected only on Russian pages.
            </p>
          </div>
          <div className="mt-8">
            <FieldInput
              name="customHeader"
              label="Custom Header Snippet (Fallback / All Languages)"
              defaultValue={customHeader.content || ""}
              isTextarea
            />
            <p className="mt-2 text-xs text-slate-500">
              Optional fallback snippet used only when the locale-specific header is empty.
            </p>
          </div>
          <p className="mt-10 text-xs uppercase tracking-[0.24em] text-slate-400">
            Body Code
          </p>
          <div className="mt-8">
            <FieldInput
              name="customBodyEn"
              label="Custom Body Snippet (English Only)"
              defaultValue={customHeader.bodyContentEn || ""}
              isTextarea
            />
            <p className="mt-2 text-xs text-slate-500">
              This snippet is injected only on English pages.
            </p>
          </div>
          <div className="mt-8">
            <FieldInput
              name="customBodyRu"
              label="Custom Body Snippet (Russian Only)"
              defaultValue={customHeader.bodyContentRu || ""}
              isTextarea
            />
            <p className="mt-2 text-xs text-slate-500">
              This snippet is injected only on Russian pages.
            </p>
          </div>
          <div className="mt-8">
            <FieldInput
              name="customBody"
              label="Custom Body Snippet (Fallback / All Languages)"
              defaultValue={customHeader.bodyContent || ""}
              isTextarea
            />
            <p className="mt-2 text-xs text-slate-500">
              Optional fallback snippet used only when the locale-specific body is empty.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-copper-600 to-copper-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:from-copper-700 hover:to-copper-500"
          >
            Save Custom Header
          </button>
        </div>
      </form>
    </div>
  );
}
