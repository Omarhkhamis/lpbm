import { prisma } from "./prisma";
import { normalizeSite } from "./sites";

export const DEFAULT_CUSTOM_HEADER = {
  content: "",
  bodyContent: ""
};

const SHARED_CUSTOM_HEADER_SITE = "global";

export const getSharedCustomHeaderSite = () => SHARED_CUSTOM_HEADER_SITE;

const findExistingCustomHeader = async () => {
  const shared = await prisma.customHeader.findUnique({
    where: { site: SHARED_CUSTOM_HEADER_SITE }
  });
  if (shared) return shared;

  const seeded = await prisma.customHeader.findFirst({
    where: {
      site: { in: ["hollywood-smile", "dental-implant"] },
      OR: [{ content: { not: "" } }, { bodyContent: { not: "" } }]
    }
  });
  if (seeded) return seeded;

  return prisma.customHeader.findFirst({
    where: { site: { in: ["hollywood-smile", "dental-implant"] } }
  });
};

export const ensureCustomHeader = async (site = "hollywood-smile") => {
  normalizeSite(site);
  const existing = await findExistingCustomHeader();
  if (existing && existing.site === SHARED_CUSTOM_HEADER_SITE) {
    return existing;
  }

  try {
    return await prisma.customHeader.create({
      data: {
        site: SHARED_CUSTOM_HEADER_SITE,
        content: existing?.content ?? DEFAULT_CUSTOM_HEADER.content,
        bodyContent: existing?.bodyContent ?? DEFAULT_CUSTOM_HEADER.bodyContent
      }
    });
  } catch (error) {
    if (error?.code === "P2002") {
      return prisma.customHeader.findUnique({
        where: { site: SHARED_CUSTOM_HEADER_SITE }
      });
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
