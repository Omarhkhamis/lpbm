"use server";

import { redirect } from "next/navigation";
import { createAdminSession, verifyAdminCredentials } from "@lib/adminAuth";
import { normalizeSite } from "@lib/sites";

const DEFAULT_SITE = "hollywood-smile";

export const loginUnifiedAction = async (formData) => {
  const site = normalizeSite(formData.get("site")) || DEFAULT_SITE;
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const user = await verifyAdminCredentials(email, password);
  if (!user) {
    redirect(`/admin90?error=1&site=${site}`);
  }

  await createAdminSession(user.id);
  redirect(`/admin90/overview?site=${site}`);
};
