import { redirect } from "next/navigation";

import { getAdminUser } from "@lib/adminAuth";
import { getSectionsByLocale } from "@lib/sections";
import { normalizeLocale, normalizeSite } from "@lib/sites";
import { logoutAction } from "./actions";
import SidebarNav from "./components/SidebarNav";
import GlobalSaveNotifier from "./components/GlobalSaveNotifier";
import LocaleSwitcher from "./components/LocaleSwitcher";
import SiteSwitcher from "./components/SiteSwitcher";

export default async function AdminShell({ children, site, locale }) {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const lang = normalizeLocale(locale);

  const user = await getAdminUser();
  if (!user) {
    redirect(`/admin90?site=${siteId}`);
  }

  const sections = await getSectionsByLocale(siteId, lang);
  const logout = logoutAction.bind(null, siteId);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-slate-200 bg-white px-6 py-6">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Admin Panel
              </p>
              <h1 className="text-lg font-semibold">BM Dashboard</h1>
            </div>
            <div className="flex flex-col gap-2">
              <SiteSwitcher site={siteId} />
            </div>
            <div className="flex flex-col gap-2">
              <LocaleSwitcher site={siteId} locale={lang} />
            </div>
          </div>

          <SidebarNav site={siteId} sections={sections} locale={lang} />

          <form action={logout} className="mt-10">
            <button
              type="submit"
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Logout
            </button>
          </form>
        </aside>

        <main className="flex-1 px-8 py-8">
          <div className="max-w-5xl">
            <GlobalSaveNotifier />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
