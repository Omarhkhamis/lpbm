"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { clearAdminSession } from "@lib/adminAuth";
import { DEFAULT_CUSTOM_HEADER } from "@lib/customHeader";
import { prisma } from "@lib/prisma";
import { getSectionDefaults } from "@lib/sectionDefaults";
import { applyFormData, mergeSectionData } from "@lib/sectionForm";
import { ensureSeoSettings } from "@lib/seoSettings";
import { normalizeLocale, normalizeSite } from "@lib/sites";

const revalidatePublic = (site, locale) => {
  revalidatePath(`/${site}/${locale}`);
};

const safeSite = (site) => normalizeSite(site) || "hollywood-smile";

export const updateSectionAction = async (site, key, formData) => {
  const siteId = safeSite(site);
  const localeParam = normalizeLocale(formData.get("locale"));

  try {
    const section = await prisma.section.findUnique({
      where: { key_locale_site: { key, locale: localeParam, site: siteId } }
    });
    const defaults = getSectionDefaults(key, localeParam, siteId);
    const baseData = mergeSectionData(defaults, section?.data ?? {});
    const updatedData = applyFormData(baseData, formData);
    const casesLengthRaw = formData.get("casesLength");
    const mediaItemsLengthRaw = formData.get("mediaItemsLength");
    const reviewsLengthRaw = formData.get("reviewsLength");
    const columnsLengthRaw = formData.get("columnsLength");
    const rowsLengthRaw = formData.get("rowsLength");
    const slidesLengthRaw = formData.get("slidesLength");
    const certificateItemsLengthRaw = formData.get("certificateItemsLength");
    const casesLength = casesLengthRaw ? Number(casesLengthRaw) : null;
    const mediaItemsLength = mediaItemsLengthRaw
      ? Number(mediaItemsLengthRaw)
      : null;
    const reviewsLength = reviewsLengthRaw ? Number(reviewsLengthRaw) : null;
    const columnsLength = columnsLengthRaw ? Number(columnsLengthRaw) : null;
    const rowsLength = rowsLengthRaw ? Number(rowsLengthRaw) : null;
    const slidesLength = slidesLengthRaw ? Number(slidesLengthRaw) : null;
    const certificateItemsLength = certificateItemsLengthRaw
      ? Number(certificateItemsLengthRaw)
      : null;

    if (key === "beforeAfter" && Number.isFinite(casesLength)) {
      updatedData.cases = Array.isArray(updatedData.cases)
        ? updatedData.cases.slice(0, casesLength)
        : [];
    }
    if (key === "teamMembers") {
      const teamLengthRaw = formData.get("teamMembersLength");
      const teamLength = teamLengthRaw ? Number(teamLengthRaw) : null;
      delete updatedData.ctaText;
      delete updatedData.ctaHref;
      if (Number.isFinite(teamLength)) {
        updatedData.items = Array.isArray(updatedData.items)
          ? updatedData.items.slice(0, teamLength)
          : [];
      }
    }

    if (key === "treatments" && Number.isFinite(mediaItemsLength)) {
      updatedData.mediaItems = Array.isArray(updatedData.mediaItems)
        ? updatedData.mediaItems.slice(0, mediaItemsLength)
        : [];
    }

    if (
      (key === "googleReviews" || key === "trustpilotReviews") &&
      Number.isFinite(reviewsLength)
    ) {
      updatedData.items = Array.isArray(updatedData.items)
        ? updatedData.items.slice(0, reviewsLength)
        : [];
    }
    if (key === "implantMatrix") {
      if (Number.isFinite(columnsLength)) {
        updatedData.columns = Array.isArray(updatedData.columns)
          ? updatedData.columns.slice(0, columnsLength)
          : [];
      }
      if (Number.isFinite(rowsLength)) {
        updatedData.rows = Array.isArray(updatedData.rows)
          ? updatedData.rows.slice(0, rowsLength)
          : [];
      }
      if (Array.isArray(updatedData.rows) && Array.isArray(updatedData.columns)) {
        updatedData.rows = updatedData.rows.map((row) => {
          const values = Array.isArray(row?.values) ? [...row.values] : [];
          if (values.length < updatedData.columns.length) {
            while (values.length < updatedData.columns.length) values.push("");
          } else if (values.length > updatedData.columns.length) {
            values.length = updatedData.columns.length;
          }
          return { ...row, values };
        });
      }
    }
    if (key === "techniquesUsed" && Number.isFinite(slidesLength)) {
      updatedData.slides = Array.isArray(updatedData.slides)
        ? updatedData.slides.slice(0, slidesLength)
        : [];
    }
    if (key === "certificatesGallery" && Number.isFinite(certificateItemsLength)) {
      updatedData.items = Array.isArray(updatedData.items)
        ? updatedData.items.slice(0, certificateItemsLength)
        : [];
    }
    if (key === "teamMembers") {
      delete updatedData.ctaText;
      delete updatedData.ctaHref;
    }

    await prisma.section.update({
      where: { key_locale_site: { key, locale: localeParam, site: siteId } },
      data: { data: updatedData }
    });
  } catch (error) {
    redirect(`/${siteId}/admin90/sections/${key}?error=1&locale=${localeParam}`);
  }

  revalidatePath(`/${siteId}/admin90/sections/${key}`);
  revalidatePath(`/${siteId}/admin90/sections`);
  revalidatePublic(siteId, localeParam);
  redirect(`/${siteId}/admin90/sections/${key}?saved=1&locale=${localeParam}`);
};

export const toggleSectionAction = async (site, key, locale = "en") => {
  const siteId = safeSite(site);
  const lang = normalizeLocale(locale);
  const section = await prisma.section.findUnique({
    where: { key_locale_site: { key, locale: lang, site: siteId } },
    select: { enabled: true }
  });

  if (!section) {
    redirect(`/${siteId}/admin90`);
  }

  await prisma.section.update({
    where: { key_locale_site: { key, locale: lang, site: siteId } },
    data: { enabled: !section.enabled }
  });

  revalidatePath(`/${siteId}/admin90/sections/${key}`);
  revalidatePath(`/${siteId}/admin90/sections`);
  revalidatePublic(siteId, lang);
  redirect(`/${siteId}/admin90/sections/${key}?locale=${lang}`);
};

export const updateGeneralSettingsAction = async (site, formData) => {
  const siteId = safeSite(site);
  try {
    const rawDelay = String(formData.get("consultationDelaySeconds") || "").trim();
    const parsedDelay = rawDelay ? Number(rawDelay) : null;
    const safeDelay =
      Number.isFinite(parsedDelay) && parsedDelay >= 0
        ? Math.round(parsedDelay)
        : null;
    const data = {
      formRecipientEmail:
        String(formData.get("formRecipientEmail") || "").trim() || null,
      whatsappLink:
        String(formData.get("whatsappLink") || "").trim() || null,
      hideFormPrivacyNote:
        String(formData.get("hideFormPrivacyNote") || "").trim() === "hide",
      logoUrl: String(formData.get("logoUrl") || "").trim() || null,
      faviconUrl: String(formData.get("faviconUrl") || "").trim() || null,
      consultationDelaySeconds: safeDelay
    };

    await prisma.generalSettings.upsert({
      where: { site: siteId },
      update: data,
      create: { site: siteId, ...data }
    });
  } catch (error) {
    redirect(`/${siteId}/admin90/general?error=1`);
  }

  revalidatePath(`/${siteId}/admin90/general`);
  revalidatePublic(siteId, "en");
  revalidatePublic(siteId, "ru");
  redirect(`/${siteId}/admin90/general?saved=1`);
};

export const updateFooterSettingsAction = async (site, formData) => {
  const siteId = safeSite(site);
  const locale = normalizeLocale(formData.get("locale") || "en");

  try {
    const data = {
      description: String(formData.get("description") || "").trim() || null,
      badge: String(formData.get("badge") || "").trim() || null,
      note: String(formData.get("note") || "").trim() || null,
      navTreatments: String(formData.get("navTreatments") || "").trim() || null,
      navPopularTreatments:
        String(formData.get("navPopularTreatments") || "").trim() || null,
      navBeforeAfter:
        String(formData.get("navBeforeAfter") || "").trim() || null,
      navTestimonials:
        String(formData.get("navTestimonials") || "").trim() || null,
      navFaqs: String(formData.get("navFaqs") || "").trim() || null,
      navHealthTourism:
        String(formData.get("navHealthTourism") || "").trim() || null,
      phoneLabel: String(formData.get("phoneLabel") || "").trim() || null,
      whatsappLabel: String(formData.get("whatsappLabel") || "").trim() || null,
      emailLabel: String(formData.get("emailLabel") || "").trim() || null,
      addressLabel: String(formData.get("addressLabel") || "").trim() || null,
      phone: String(formData.get("phone") || "").trim() || null,
      whatsappNumber:
        String(formData.get("whatsappNumber") || "").trim() || null,
      whatsappLink: String(formData.get("whatsappLink") || "").trim() || null,
      email: String(formData.get("email") || "").trim() || null,
      address: String(formData.get("address") || "").trim() || null,
      footerLogoUrl: String(formData.get("footerLogoUrl") || "").trim() || null,
      copyright: String(formData.get("copyright") || "").trim() || null,
      privacy: String(formData.get("privacy") || "").trim() || null,
      terms: String(formData.get("terms") || "").trim() || null,
      instagram: String(formData.get("instagram") || "").trim() || null,
      facebook: String(formData.get("facebook") || "").trim() || null,
      youtube: String(formData.get("youtube") || "").trim() || null
    };

    await prisma.footerSettings.upsert({
      where: { site_locale: { site: siteId, locale } },
      update: { data },
      create: { site: siteId, locale, data }
    });
  } catch (error) {
    redirect(`/${siteId}/admin90/footer?error=1&locale=${locale}`);
  }

  revalidatePath(`/${siteId}/admin90/footer`);
  revalidatePublic(siteId, locale);
  redirect(`/${siteId}/admin90/footer?saved=1&locale=${locale}`);
};

export const updateSeoSettingsAction = async (site, formData) => {
  const siteId = safeSite(site);
  const locale = normalizeLocale(formData.get("locale") || "en");

  try {
    const existing = await ensureSeoSettings(siteId, locale);
    const metaTitle =
      String(formData.get("metaTitle") || "").trim() || existing?.metaTitle || "";
    const metaDescription =
      String(formData.get("metaDescription") || "").trim() ||
      existing?.metaDescription ||
      "";
    const metaKeywords = String(formData.get("metaKeywords") || "").trim() || null;
    const metaImage = String(formData.get("metaImage") || "").trim() || null;

    await prisma.seoSettings.upsert({
      where: { site_locale: { site: siteId, locale } },
      update: { metaTitle, metaDescription, metaKeywords, metaImage },
      create: {
        site: siteId,
        locale,
        metaTitle,
        metaDescription,
        metaKeywords,
        metaImage
      }
    });
  } catch (error) {
    redirect(`/${siteId}/admin90/seo?error=1&locale=${locale}`);
  }

  revalidatePublic(siteId, locale);
  redirect(`/${siteId}/admin90/seo?saved=1&locale=${locale}`);
};

export const updateCustomHeaderAction = async (site, formData) => {
  const siteId = safeSite(site);
  try {
    const content =
      String(formData.get("customHeader") || "").trim() ||
      DEFAULT_CUSTOM_HEADER.content;
    const bodyContent =
      String(formData.get("customBody") || "").trim() ||
      DEFAULT_CUSTOM_HEADER.bodyContent;

    await prisma.customHeader.upsert({
      where: { site: siteId },
      update: { content, bodyContent },
      create: { site: siteId, content, bodyContent }
    });
  } catch (error) {
    redirect(`/${siteId}/admin90/custom-header?error=1`);
  }

  revalidatePublic(siteId, "en");
  revalidatePublic(siteId, "ru");
  redirect(`/${siteId}/admin90/custom-header?saved=1`);
};

export const updatePageAction = async (site, slug, formData) => {
  const siteId = safeSite(site);
  try {
    const title = String(formData.get("title") || "").trim();
    const content = String(formData.get("content") || "").trim();
    await prisma.page.update({
      where: { slug },
      data: {
        title: title || "Untitled",
        content
      }
    });
  } catch (error) {
    redirect(`/${siteId}/admin90/pages/${slug}?error=1`);
  }

  revalidatePath(`/${siteId}/admin90/pages/${slug}`);
  revalidatePath(`/${slug}`);
  redirect(`/${siteId}/admin90/pages/${slug}?saved=1`);
};

export const createAdminUserAction = async (site, formData) => {
  const siteId = safeSite(site);
  try {
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    if (!email || password.length < 6) {
      redirect(`/${siteId}/admin90/admin-users?error=1`);
    }

    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      redirect(`/${siteId}/admin90/admin-users?error=1`);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.adminUser.create({
      data: { email, passwordHash }
    });
  } catch (error) {
    redirect(`/${siteId}/admin90/admin-users?error=1`);
  }

  revalidatePath(`/${siteId}/admin90/admin-users`);
  redirect(`/${siteId}/admin90/admin-users?saved=1`);
};

export const reorderSectionsAction = async (site, formData) => {
  const siteId = safeSite(site);
  const rawOrder = String(formData.get("order") || "[]");
  const locale = normalizeLocale(formData.get("locale") || "en");
  let keys = [];
  try {
    const parsed = JSON.parse(rawOrder);
    if (Array.isArray(parsed)) keys = parsed.map((item) => String(item));
  } catch {
    keys = [];
  }

  const existing = await prisma.section.findMany({
    where: { locale, site: siteId },
    select: { key: true }
  });
  const existingKeys = new Set(existing.map((item) => item.key));
  const filtered = keys.filter((key) => existingKeys.has(key));
  const missing = existing
    .map((item) => item.key)
    .filter((key) => !filtered.includes(key));
  const finalOrder = [...filtered, ...missing];

  await Promise.all(
    finalOrder.map((key, index) =>
      prisma.section.update({
        where: { key_locale_site: { key, locale, site: siteId } },
        data: { sortOrder: index }
      })
    )
  );

  revalidatePath(`/${siteId}/admin90`);
  revalidatePath(`/${siteId}/admin90/overview`);
  revalidatePath(`/${siteId}/admin90/sections`);
  revalidatePublic(siteId, locale);
  redirect(`/${siteId}/admin90/sections?reordered=1&locale=${locale}`);
};

export const updateAdminUserAction = async (site, formData) => {
  const siteId = safeSite(site);
  try {
    const id = String(formData.get("id") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    if (!id || (!email && !password)) {
      redirect(`/${siteId}/admin90/admin-users?error=1`);
    }

    const data = {};

    if (email) {
      const existing = await prisma.adminUser.findUnique({ where: { email } });
      if (existing && existing.id !== id) {
        redirect(`/${siteId}/admin90/admin-users?error=1`);
      }
      data.email = email;
    }

    if (password) {
      if (password.length < 6) {
        redirect(`/${siteId}/admin90/admin-users?error=1`);
      }
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    await prisma.adminUser.update({
      where: { id },
      data
    });
  } catch (error) {
    redirect(`/${siteId}/admin90/admin-users?error=1`);
  }

  revalidatePath(`/${siteId}/admin90/admin-users`);
  redirect(`/${siteId}/admin90/admin-users?saved=1`);
};

export const logoutAction = async (site) => {
  const siteId = safeSite(site);
  await clearAdminSession();
  redirect(`/admin90?site=${siteId}`);
};
