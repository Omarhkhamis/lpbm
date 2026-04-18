import { getGeneralSettings } from "@lib/generalSettings";
import { DEFAULT_POPUP_FORM_SETTINGS } from "@lib/popupFormDefaults";
import { normalizeSite } from "@lib/sites";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const site = normalizeSite(searchParams.get("site")) || "hollywood-smile";

  try {
    const settings = await getGeneralSettings(site);
    return Response.json({
      ok: true,
      site,
      popupFormTitle:
        settings.popupFormTitle || DEFAULT_POPUP_FORM_SETTINGS.popupFormTitle,
      popupFormBody:
        settings.popupFormBody || DEFAULT_POPUP_FORM_SETTINGS.popupFormBody,
      popupWhatsappMessage:
        settings.popupWhatsappMessage ||
        DEFAULT_POPUP_FORM_SETTINGS.popupWhatsappMessage
    });
  } catch {
    return Response.json({
      ok: true,
      site,
      ...DEFAULT_POPUP_FORM_SETTINGS
    });
  }
}
