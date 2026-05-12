import { redirect } from "next/navigation";

import { getAdminUser } from "./adminAuth";
import { getDataHomePath, isDataViewer, isFullAdmin } from "./adminPermissions";
import { normalizeSite } from "./sites";

export const requireAdminUser = async (site = "hollywood-smile") => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const user = await getAdminUser();
  if (!user) {
    redirect(`/admin90?site=${siteId}`);
  }
  return user;
};

export const requireFullAdmin = async (
  site = "hollywood-smile",
  { scoped = false } = {}
) => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const user = await requireAdminUser(siteId);
  if (!isFullAdmin(user)) {
    redirect(getDataHomePath(user, siteId, { scoped }));
  }
  return user;
};

export const requireDataAccess = async (site = "hollywood-smile") => {
  const user = await requireAdminUser(site);
  if (!isFullAdmin(user) && !isDataViewer(user)) {
    redirect(`/admin90?site=${normalizeSite(site) || "hollywood-smile"}`);
  }
  return user;
};
