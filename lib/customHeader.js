import { prisma } from "./prisma";
import { normalizeSite } from "./sites";

export const DEFAULT_CUSTOM_HEADER = {
  content: "",
  bodyContent: ""
};

export const ensureCustomHeader = async (site = "hollywood-smile") => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  return prisma.customHeader.upsert({
    where: { site: siteId },
    update: {},
    create: { ...DEFAULT_CUSTOM_HEADER, site: siteId }
  });
};

export const getCustomHeader = async (site = "hollywood-smile") => {
  const record = await ensureCustomHeader(site);
  return {
    ...DEFAULT_CUSTOM_HEADER,
    ...record
  };
};
