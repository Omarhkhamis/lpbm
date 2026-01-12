"use client";

import { usePathname, useSearchParams } from "next/navigation";

const SITES = [
  { id: "hollywood-smile", label: "Hollywood Smile" },
  { id: "dental-implant", label: "Dental Implant" }
];

const buildHref = (pathname, searchParams, targetSite) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set("site", targetSite);
  const base = pathname || "/admin90";

  const query = params.toString();
  return `${base}${query ? `?${query}` : ""}`;
};

export default function SiteSwitcher({ site: siteProp }) {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const currentSite = siteProp || searchParams.get("site") || "hollywood-smile";

  return (
    <select
      className="w-48 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-700 shadow-sm focus:border-copper-300 focus:outline-none focus:ring-2 focus:ring-copper-200/60"
      value={currentSite}
      onChange={(e) => {
        const href = buildHref(pathname, searchParams, e.target.value);
        window.location.href = href;
      }}
    >
      {SITES.map((site) => (
        <option key={site.id} value={site.id}>
          {site.label}
        </option>
      ))}
    </select>
  );
}
