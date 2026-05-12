import { notFound } from "next/navigation";

import CustomHeadSnippet from "../../../components/CustomHeadSnippet";
import {
  getCustomHeader,
  getLocalizedCustomBodyContent
} from "../../../../lib/customHeader";

export const dynamic = "force-dynamic";

export default async function LocaleLayout({ children, params }) {
  const locale = params?.locale?.toLowerCase();

  if (!["en", "ru"].includes(locale)) {
    notFound();
  }

  const customHeader = await getCustomHeader("dental-implant");
  const localizedBodyContent = getLocalizedCustomBodyContent(customHeader, locale);

  return (
    <>
      <CustomHeadSnippet html={customHeader?.content} />
      {children}
      {customHeader?.bodyContent ? (
        <div dangerouslySetInnerHTML={{ __html: customHeader.bodyContent }} />
      ) : null}
      {localizedBodyContent ? (
        <div dangerouslySetInnerHTML={{ __html: localizedBodyContent }} />
      ) : null}
    </>
  );
}
