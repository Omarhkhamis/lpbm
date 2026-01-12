import Link from "next/link";
import { cookies } from "next/headers";

import { getAdminUser } from "@lib/adminAuth";
import { SITES } from "@lib/sites";
import { loginUnifiedAction } from "./actions";

const DEFAULT_SITE = "hollywood-smile";

export default async function AdminRootPage({ searchParams }) {
  const user = await getAdminUser();
  const cookieSite = cookies().get("admin_site")?.value;
  const site =
    SITES.find((s) => s.id === searchParams?.site)?.id ||
    SITES.find((s) => s.id === cookieSite)?.id ||
    DEFAULT_SITE;
  const action = loginUnifiedAction;
  const showError = searchParams?.error === "1";

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-300">
            Sign in to manage all landing pages.
          </p>

          {showError ? (
            <div className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              Invalid email or password.
            </div>
          ) : null}

          <form action={action} className="mt-6 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Site
              </label>
              <select
                name="site"
                defaultValue={site}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
              >
                {SITES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-400/40"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-copper-600 to-copper-500 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:from-copper-700 hover:to-copper-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-slate-300">
          Choose which site to manage.
        </p>
        <div className="grid gap-3">
          {SITES.map((item) => (
            <Link
              key={item.id}
              href={`/admin90/overview?site=${item.id}`}
              className="rounded-lg border border-white/10 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-white hover:border-copper-300 hover:bg-slate-800 transition"
            >
              Open {item.label} Admin
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
