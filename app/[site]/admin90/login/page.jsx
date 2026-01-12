import { notFound, redirect } from "next/navigation";

import { ensureDefaultAdmin, getAdminUser } from "@lib/adminAuth";
import { normalizeSite } from "@lib/sites";
import { loginAction } from "./actions";

export default async function AdminLoginPage({ searchParams, params }) {
  const site = normalizeSite(params?.site);
  if (!site) {
    notFound();
  }
  // Always route to unified admin login
  redirect(`/admin90?site=${site}`);
}
