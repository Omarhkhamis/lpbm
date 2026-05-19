import { notFound } from "next/navigation";

import CustomHeadSnippet from "../../../components/CustomHeadSnippet";
import {
  getCustomHeader,
  getLocalizedCustomHeadContent,
  getLocalizedCustomBodyContent
} from "../../../../lib/customHeader";
import { normalizeLocale } from "../../../../lib/sites";

export const dynamic = "force-dynamic";

export default async function LocaleLayout({ children, params }) {
  const locale = normalizeLocale(params?.locale);
  if (!["en", "ru"].includes(locale)) {
    notFound();
  }

  const customHeader = await getCustomHeader("hollywood-smile");
  const localizedHeadContent = getLocalizedCustomHeadContent(customHeader, locale);
  const localizedBodyContent = getLocalizedCustomBodyContent(customHeader, locale);

  return (
    <>
      <CustomHeadSnippet html={localizedHeadContent} />
      {children}
      {localizedBodyContent ? (
        <div dangerouslySetInnerHTML={{ __html: localizedBodyContent }} />
      ) : null}
    </>
  );
}
