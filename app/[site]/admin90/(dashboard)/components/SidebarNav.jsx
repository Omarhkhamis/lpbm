"use client";

import { usePathname } from "next/navigation";

import { normalizeDataLocaleAccess } from "@lib/adminPermissions";
import CollapsibleNavGroup from "./CollapsibleNavGroup";
import SectionsNav from "./SectionsNav";

export default function SidebarNav({
  site,
  sections,
  locale = "en",
  isDataViewer = false,
  dataLocaleAccess = "all"
}) {
  const pathname = usePathname() || "";
  const prefix = `/${site}/admin90`;
  const dataParams = new URLSearchParams();
  const allowedLanguage = normalizeDataLocaleAccess(dataLocaleAccess);
  if (isDataViewer && allowedLanguage !== "all") {
    dataParams.set("language", allowedLanguage);
  }
  const dataQuery = dataParams.toString();
  const dataSuffix = dataQuery ? `?${dataQuery}` : "";
  const isPages = pathname.startsWith(`${prefix}/pages`);
  const isData =
    pathname.startsWith(`${prefix}/spin-data`) ||
    pathname.startsWith(`${prefix}/form-data`);
  const isSettings =
    pathname.startsWith(`${prefix}/overview`) ||
    pathname.startsWith(`${prefix}/general`) ||
    pathname.startsWith(`${prefix}/popup-form`) ||
    pathname.startsWith(`${prefix}/footer`) ||
    pathname.startsWith(`${prefix}/seo`) ||
    pathname.startsWith(`${prefix}/media`) ||
    pathname.startsWith(`${prefix}/admin-users`) ||
    pathname.startsWith(`${prefix}/custom-header`) ||
    pathname.startsWith(`${prefix}/sections`);

  return (
    <nav className="mt-8 space-y-6">
      {!isDataViewer ? (
        <SectionsNav site={site} locale={locale} sections={sections} />
      ) : null}

      {!isDataViewer ? (
        <CollapsibleNavGroup
          title="Pages"
          items={[
            { label: "Thank You (EN)", href: `${prefix}/pages/thankyou-en` },
            { label: "Thank You (RU)", href: `${prefix}/pages/thankyou-ru` },
            { label: "Privacy Policy (EN)", href: `${prefix}/pages/privacy-policy-en` },
            { label: "Privacy Policy (RU)", href: `${prefix}/pages/privacy-policy-ru` },
            { label: "Terms (EN)", href: `${prefix}/pages/terms-en` },
            { label: "Terms (RU)", href: `${prefix}/pages/terms-ru` }
          ]}
          defaultOpen={false}
          isActive={isPages}
        />
      ) : null}

      <CollapsibleNavGroup
        title="Data - Leads"
        items={[
          { label: "Spin Data", href: `${prefix}/spin-data${dataSuffix}` },
          { label: "Form Data", href: `${prefix}/form-data${dataSuffix}` }
        ]}
        defaultOpen={isDataViewer}
        isActive={isData}
      />

      {!isDataViewer ? (
        <CollapsibleNavGroup
          title="Settings"
          items={[
            { label: "Overview", href: `${prefix}/overview?locale=${locale}` },
            { label: "General", href: `${prefix}/general` },
            { label: "Popup Form", href: `${prefix}/popup-form` },
            { label: "Footer", href: `${prefix}/footer?locale=${locale}` },
            { label: "Reorder Sections", href: `${prefix}/sections?locale=${locale}` },
            { label: "Custom Codes", href: `${prefix}/custom-header` },
            { label: "SEO", href: `${prefix}/seo?locale=${locale}` },
            { label: "Media", href: `${prefix}/media` },
            { label: "Admin Users", href: `${prefix}/admin-users` }
          ]}
          defaultOpen={false}
          isActive={isSettings}
        />
      ) : null}
    </nav>
  );
}
