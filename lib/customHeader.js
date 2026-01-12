import { prisma } from "./prisma";
import { normalizeSite } from "./sites";

export const DEFAULT_CUSTOM_HEADER = {
  content: "",
  bodyContent: ""
};

export const ensureCustomHeader = async (site = "hollywood-smile") => {
  const siteId = normalizeSite(site) || "hollywood-smile";
  const existing = await prisma.customHeader.findUnique({
    where: { site: siteId }
  });
  if (existing) return existing;

  try {
    return await prisma.customHeader.create({
      data: { ...DEFAULT_CUSTOM_HEADER, site: siteId }
    });
  } catch (error) {
    if (error?.code === "P2002") {
      return prisma.customHeader.findUnique({ where: { site: siteId } });
    }
    throw error;
  }
};

export const getCustomHeader = async (site = "hollywood-smile") => {
  const record = await ensureCustomHeader(site);
  return {
    ...DEFAULT_CUSTOM_HEADER,
    ...record
  };
};
