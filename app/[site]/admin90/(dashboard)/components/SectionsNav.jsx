"use client";

import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";

import CollapsibleNavGroup from "./CollapsibleNavGroup";

export default function SectionsNav({ site, sections, locale: localeProp = "en" }) {
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const localeFromSearch = searchParams.get("locale") === "ru" ? "ru" : "en";
  const locale = localeProp || localeFromSearch;
  const base = `/${site}/admin90/sections`;
  const isActive = pathname.startsWith(base);

  const items = sections.map((section) => ({
    label: section.label,
    href: `${base}/${section.key}?locale=${locale}`,
    statusLabel: section.enabled ? "On" : "Off",
    statusClassName: section.enabled ? "text-emerald-500" : "text-slate-400"
  }));

  return (
    <CollapsibleNavGroup
      title="Sections"
      items={items}
      defaultOpen={false}
      isActive={isActive}
    />
  );
}
