import { notFound } from "next/navigation";

import CustomHeadSnippet from "../../../components/CustomHeadSnippet";
import {
  getCustomHeader,
  getLocalizedCustomHeadContent,
  getLocalizedCustomBodyContent
} from "../../../../lib/customHeader";

export const dynamic = "force-dynamic";

export default async function LocaleLayout({ children, params }) {
  const locale = params?.locale?.toLowerCase();

  if (!["en", "ru"].includes(locale)) {
    notFound();
  }

  const customHeader = await getCustomHeader("dental-implant");
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
