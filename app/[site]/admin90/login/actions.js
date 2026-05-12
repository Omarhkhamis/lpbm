"use server";

import { redirect } from "next/navigation";
import { createAdminSession, verifyAdminCredentials } from "@lib/adminAuth";
import { getDataHomePath, isDataViewer } from "@lib/adminPermissions";
import { normalizeSite } from "@lib/sites";

export const loginAction = async (site, formData) => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const user = await verifyAdminCredentials(email, password);
  if (!user) {
    redirect(`/admin90?site=${siteId}&error=1`);
  }

  await createAdminSession(user.id);
  if (isDataViewer(user)) {
    redirect(getDataHomePath(user, siteId));
  }
  redirect(`/admin90/overview?site=${siteId}`);
};
