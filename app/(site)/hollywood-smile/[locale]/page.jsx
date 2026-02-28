import { notFound, redirect } from "next/navigation";

import Footer from "../en/components/Footer";
import Header from "../en/components/Header";
import Overlays from "../en/components/Overlays";
import { getFooterSettings } from "@lib/footerSettings";
import { getGeneralSettings } from "@lib/generalSettings";
import { getSectionsMap } from "@lib/sections";
import { getSeoSettings } from "@lib/seoSettings";
import { normalizeLocale } from "@lib/sites";
import {
  HeroSlide,
  HollywoodSmileSec,
  PopularTreatments,
  BookAppointmentFormSec,
  BeforeAfter,
  CertificatesGallery,
  FullWidthCampaignBanner,
  StepFormSec,
  Treatments,
  BookAppointmentFormSec2,
  InternationalPatientsSec,
  TeamMembers,
  ClinicSec,
  HealthTourism,
  LuckySpinFormSec,
  LocalAttractions,
  GoogleReviews,
  TrustpilotReviews,
  Faqs
} from "../en/components/sections";

export const viewport = {
  width: "device-width",
  initialScale: 1
};

export const dynamic = "force-dynamic";
const SUPPORTED_LOCALES = ["en", "ru"];
const SITE = "hollywood-smile";

export async function generateMetadata({ params }) {
  const locale = normalizeLocale(params?.locale);
  if (locale === "admin90") {
    redirect(`/admin90?site=${SITE}`);
  }
  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  const [seo, general] = await Promise.all([
    getSeoSettings(SITE, locale),
    getGeneralSettings(SITE)
  ]);
  const keywords = seo.metaKeywords
    ? seo.metaKeywords.split(",").map((item) => item.trim()).filter(Boolean)
    : undefined;
  const icon = general?.faviconUrl || "/uploads/favicon.ico";
  const envBase =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "https://lp.bmturkiye.com";
  const baseUrl = envBase || "https://lp.bmturkiye.com";
  const toAbsolute = (path) => {
    if (!path) return undefined;

    // If absolute but from localhost, rebase to production domain with same pathname.
    try {
      const url = new URL(path);
      const host = url.hostname.toLowerCase();
      if (host.includes("localhost") || host === "127.0.0.1" || host === "0.0.0.0") {
        return baseUrl ? `${baseUrl}${url.pathname}` : undefined;
      }
      return path;
    } catch {
      // not absolute, continue.
    }

    if (!baseUrl) return undefined;
    try {
      return new URL(path, baseUrl).toString();
    } catch {
      return undefined;
    }
  };
  const rawImage = seo.metaImage || general?.logoUrl || null;
  const resolvedImage = toAbsolute(rawImage);

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords,
    robots: {
      index: true,
      follow: true
    },
    alternates: {
      ...(baseUrl
        ? {
            canonical: `${baseUrl}/hollywood-smile/${locale}`,
            languages: {
              en: `${baseUrl}/hollywood-smile/en`,
              ru: `${baseUrl}/hollywood-smile/ru`,
              "x-default": `${baseUrl}/hollywood-smile/en`
            }
          }
        : {})
    },
    openGraph: {
      type: "website",
      siteName: "BM TÜRKIEY",
      locale,
      title: seo.metaTitle,
      description: seo.metaDescription,
      ...(baseUrl ? { url: `${baseUrl}/hollywood-smile/${locale}` } : {}),
      images: resolvedImage ? [{ url: resolvedImage }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: resolvedImage ? [resolvedImage] : undefined
    },
    icons: icon ? { icon } : undefined
  };
}

export default async function HollywoodSmilePage({ params }) {
  const locale = normalizeLocale(params?.locale);
  if (locale === "admin90") {
    redirect(`/admin90?site=${SITE}`);
  }
  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  const [sectionsMap, general, footer] = await Promise.all([
    getSectionsMap(SITE, locale),
    getGeneralSettings(SITE),
    getFooterSettings(SITE, locale)
  ]);
  const whatsappNumber = footer?.whatsappNumber
    ? footer.whatsappNumber.replace(/\s+/g, "")
    : null;
  const whatsappLink =
    general?.whatsappLink ||
    footer?.whatsappLink ||
    (whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/+905382112583");

  return (
    <>
      <Header general={general} footer={footer} locale={locale} />
      <main>
        {sectionsMap.hero?.enabled ? (
          <HeroSlide data={sectionsMap.hero?.data} whatsappLink={whatsappLink} />
        ) : null}
        {sectionsMap.teamMembers?.enabled ? (
          <TeamMembers data={sectionsMap.teamMembers?.data} />
        ) : null}
        {sectionsMap.hollywoodSmile?.enabled ? (
          <HollywoodSmileSec data={sectionsMap.hollywoodSmile?.data} />
        ) : null}
        {sectionsMap.popularTreatments?.enabled ? (
          <PopularTreatments
            data={sectionsMap.popularTreatments?.data}
            whatsappLink={whatsappLink}
          />
        ) : null}
        {sectionsMap.bookAppointmentPrimary?.enabled ? (
          <BookAppointmentFormSec
            data={sectionsMap.bookAppointmentPrimary?.data}
          />
        ) : null}
        {sectionsMap.beforeAfter?.enabled ? (
          <BeforeAfter data={sectionsMap.beforeAfter?.data} />
        ) : null}
        {sectionsMap.certificatesGallery?.enabled ? (
          <CertificatesGallery data={sectionsMap.certificatesGallery?.data} />
        ) : null}
        {sectionsMap.fullWidthCampaign?.enabled ? (
          <FullWidthCampaignBanner
            data={sectionsMap.fullWidthCampaign?.data}
          />
        ) : null}
        {sectionsMap.stepForm?.enabled ? (
          <StepFormSec data={sectionsMap.stepForm?.data} />
        ) : null}
        {sectionsMap.treatments?.enabled ? (
          <Treatments data={sectionsMap.treatments?.data} />
        ) : null}
        {sectionsMap.bookAppointmentSecondary?.enabled ? (
          <BookAppointmentFormSec2
            data={sectionsMap.bookAppointmentSecondary?.data}
          />
        ) : null}
        {sectionsMap.internationalPatients?.enabled ? (
          <InternationalPatientsSec
            data={sectionsMap.internationalPatients?.data}
          />
        ) : null}
        {sectionsMap.clinic?.enabled ? (
          <ClinicSec data={sectionsMap.clinic?.data} whatsappLink={whatsappLink} />
        ) : null}
        {sectionsMap.healthTourism?.enabled ? (
          <HealthTourism data={sectionsMap.healthTourism?.data} />
        ) : null}
        {sectionsMap.luckySpin?.enabled ? (
          <LuckySpinFormSec
            idPrefix="lucky-section"
            data={sectionsMap.luckySpin?.data}
            locale={locale}
            site={SITE}
          />
        ) : null}
        {sectionsMap.localAttractions?.enabled ? (
          <LocalAttractions
            data={sectionsMap.localAttractions?.data}
            whatsappLink={whatsappLink}
          />
        ) : null}
        {sectionsMap.googleReviews?.enabled ? (
          <GoogleReviews data={sectionsMap.googleReviews?.data} />
        ) : null}
        {sectionsMap.trustpilotReviews?.enabled ? (
          <TrustpilotReviews data={sectionsMap.trustpilotReviews?.data} />
        ) : null}
        {sectionsMap.faqs?.enabled ? (
          <Faqs data={sectionsMap.faqs?.data} />
        ) : null}
      </main>
      <Footer general={general} footer={footer} locale={locale} site={SITE} />
      <Overlays
        heroData={sectionsMap.hero?.data}
        consultationDelaySeconds={general?.consultationDelaySeconds}
        whatsappLink={whatsappLink}
        luckySpinData={sectionsMap.luckySpin?.data}
        locale={locale}
        site={SITE}
      />
    </>
  );
}
