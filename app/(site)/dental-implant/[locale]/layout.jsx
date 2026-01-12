import { notFound } from "next/navigation";

import CustomHeadSnippet from "../../../components/CustomHeadSnippet";
import { getCustomHeader } from "../../../../lib/customHeader";

export const dynamic = "force-dynamic";

export default async function LocaleLayout({ children, params }) {
  const locale = params?.locale?.toLowerCase();

  if (!["en", "ru"].includes(locale)) {
    notFound();
  }

  const customHeader = await getCustomHeader("dental-implant");

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
