import { notFound } from "next/navigation";

import CustomHeadSnippet from "../../../components/CustomHeadSnippet";
import { getCustomHeader } from "../../../../lib/customHeader";
import { normalizeLocale } from "../../../../lib/sites";

export const dynamic = "force-dynamic";

export default async function LocaleLayout({ children, params }) {
  const locale = normalizeLocale(params?.locale);
  if (!["en", "ru"].includes(locale)) {
    notFound();
  }

  const customHeader = await getCustomHeader("hollywood-smile");

  return (
    <html lang={locale}>
      <body>
        <CustomHeadSnippet html={customHeader?.content} />
        {children}
        {customHeader?.bodyContent ? (
          <div dangerouslySetInnerHTML={{ __html: customHeader.bodyContent }} />
        ) : null}
      </body>
    </html>
  );
}
