"use client";

import { usePathname } from "next/navigation";

import CollapsibleNavGroup from "./CollapsibleNavGroup";
import SectionsNav from "./SectionsNav";

export default function SidebarNav({ site, sections, locale = "en" }) {
  const pathname = usePathname() || "";
  const prefix = "/admin90";
  const baseQuery = new URLSearchParams({ site, locale }).toString();
  const siteQuery = new URLSearchParams({ site }).toString();
  const isPages = pathname.startsWith(`${prefix}/pages`);
  const isData =
    pathname.startsWith(`${prefix}/spin-data`) ||
    pathname.startsWith(`${prefix}/form-data`);
  const isSettings =
    pathname.startsWith(`${prefix}/overview`) ||
    pathname.startsWith(`${prefix}/general`) ||
    pathname.startsWith(`${prefix}/seo`) ||
    pathname.startsWith(`${prefix}/media`) ||
    pathname.startsWith(`${prefix}/admin-users`) ||
    pathname.startsWith(`${prefix}/custom-header`) ||
    pathname.startsWith(`${prefix}/sections`);

  return (
    <nav className="mt-8 space-y-6">
      <SectionsNav site={site} locale={locale} sections={sections} />

      <CollapsibleNavGroup
        title="Pages"
        items={[
          { label: "Thank You (EN)", href: `${prefix}/pages/thankyou-en?${siteQuery}` },
          { label: "Thank You (RU)", href: `${prefix}/pages/thankyou-ru?${siteQuery}` },
          { label: "Privacy Policy (EN)", href: `${prefix}/pages/privacy-policy-en?${siteQuery}` },
          { label: "Privacy Policy (RU)", href: `${prefix}/pages/privacy-policy-ru?${siteQuery}` },
          { label: "Terms (EN)", href: `${prefix}/pages/terms-en?${siteQuery}` },
          { label: "Terms (RU)", href: `${prefix}/pages/terms-ru?${siteQuery}` }
        ]}
        defaultOpen={false}
        isActive={isPages}
      />

      <CollapsibleNavGroup
        title="Data - Leads"
        items={[
          { label: "Spin Data", href: `${prefix}/spin-data?${siteQuery}` },
          { label: "Form Data", href: `${prefix}/form-data?${siteQuery}` }
        ]}
        defaultOpen={false}
        isActive={isData}
      />

      <CollapsibleNavGroup
        title="Settings"
        items={[
          { label: "Overview", href: `${prefix}/overview?${baseQuery}` },
          { label: "General", href: `${prefix}/general?${siteQuery}` },
          { label: "Reorder Sections", href: `${prefix}/sections?${baseQuery}` },
          { label: "Custom Codes", href: `${prefix}/custom-header?${siteQuery}` },
          { label: "SEO", href: `${prefix}/seo?${baseQuery}` },
          { label: "Media", href: `${prefix}/media?${siteQuery}` },
          { label: "Admin Users", href: `${prefix}/admin-users?${siteQuery}` }
        ]}
        defaultOpen={false}
        isActive={isSettings}
      />
    </nav>
  );
}
