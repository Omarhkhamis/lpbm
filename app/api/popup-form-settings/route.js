import {
  getGeneralSettings,
  getLocalizedPopupFormSettings,
  getLocalizedWhatsappLink
} from "@lib/generalSettings";
import { getDefaultPopupFormSettings } from "@lib/popupFormDefaults";
import { normalizeLocale, normalizeSite } from "@lib/sites";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const site = normalizeSite(searchParams.get("site")) || "hollywood-smile";
  const locale = normalizeLocale(searchParams.get("locale"));

  try {
    const settings = await getGeneralSettings(site);
    const popupSettings = getLocalizedPopupFormSettings(settings, locale);
    return Response.json({
      ok: true,
      site,
      locale,
      whatsappLink: getLocalizedWhatsappLink(settings, locale),
      ...popupSettings
    });
  } catch {
    return Response.json({
      ok: true,
      site,
      locale,
      ...getDefaultPopupFormSettings(locale)
    });
  }
}
