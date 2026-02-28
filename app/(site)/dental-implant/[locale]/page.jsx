import { notFound, redirect } from "next/navigation";

import Footer from "../en/components/Footer";
import Header from "../en/components/Header";
import Overlays from "../en/components/Overlays";
import { getFooterSettings } from "@lib/footerSettings";
import { getGeneralSettings } from "@lib/generalSettings";
import { getSectionsByLocale, getSectionsMap } from "@lib/sections";
import { getSeoSettings } from "@lib/seoSettings";
import {
  HeroSlide,
  DentalImplantSec,
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
  ImplantMatrix,
  TechniquesUsed,
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
const SITE = "dental-implant";

const toAbsolute = (path, baseUrl) => {
  if (!path) return undefined;

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

const normalizeLocale = (paramsLocale) => {
  const locale = paramsLocale?.toLowerCase();
  // Prevent admin paths from falling into the public locale route
  if (locale === "admin90") {
    redirect(`/admin90?site=${SITE}`);
  }
  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }
  return locale;
};

export async function generateMetadata({ params }) {
  const locale = normalizeLocale(params?.locale);
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
  const canonicalPath = `${baseUrl}/dental-implant/${locale}`;
  const rawImage = seo.metaImage || general?.logoUrl || null;
  const resolvedImage = toAbsolute(rawImage, baseUrl);

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
            canonical: canonicalPath,
            languages: {
              en: `${baseUrl}/dental-implant/en`,
              ru: `${baseUrl}/dental-implant/ru`,
              "x-default": `${baseUrl}/dental-implant/en`
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
      ...(baseUrl ? { url: canonicalPath } : {}),
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

export default async function DentalImplantPage({ params }) {
  const locale = normalizeLocale(params?.locale);
  const [sectionsMap, orderedSections, general, footer] = await Promise.all([
    getSectionsMap(SITE, locale),
    getSectionsByLocale(SITE, locale),
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
        {orderedSections
          .filter((section) => sectionsMap[section.key]?.enabled)
          .map((section) => {
            const data = sectionsMap[section.key]?.data;
            switch (section.key) {
              case "hero":
                return (
                  <HeroSlide
                    key={section.key}
                    data={data}
                    whatsappLink={whatsappLink}
                  />
                );
              case "dentalImplant":
                return <DentalImplantSec key={section.key} data={data} />;
              case "popularTreatments":
                return (
                  <PopularTreatments
                    key={section.key}
                    data={data}
                    whatsappLink={whatsappLink}
                  />
                );
              case "bookAppointmentPrimary":
                return (
                  <BookAppointmentFormSec
                    key={section.key}
                    data={data}
                  />
                );
              case "beforeAfter":
                return <BeforeAfter key={section.key} data={data} />;
              case "certificatesGallery":
                return <CertificatesGallery key={section.key} data={data} />;
              case "fullWidthCampaign":
                return <FullWidthCampaignBanner key={section.key} data={data} />;
              case "stepForm":
                return <StepFormSec key={section.key} data={data} />;
              case "treatments":
                return <Treatments key={section.key} data={data} />;
              case "bookAppointmentSecondary":
                return (
                  <BookAppointmentFormSec2
                    key={section.key}
                    data={data}
                  />
                );
              case "internationalPatients":
                return (
                  <InternationalPatientsSec key={section.key} data={data} />
                );
              case "teamMembers":
                return <TeamMembers key={section.key} data={data} />;
              case "clinic":
                return (
                  <ClinicSec
                    key={section.key}
                    data={data}
                    whatsappLink={whatsappLink}
                  />
                );
              case "healthTourism":
                return <HealthTourism key={section.key} data={data} />;
              case "luckySpin":
                return (
                  <LuckySpinFormSec
                    key={section.key}
                    idPrefix="lucky-section"
                    data={data}
                    locale={locale}
                    site={SITE}
                  />
                );
              case "localAttractions":
                return (
                  <LocalAttractions
                    key={section.key}
                    data={data}
                    whatsappLink={whatsappLink}
                  />
                );
              case "implantMatrix":
                return <ImplantMatrix key={section.key} data={data} />;
              case "techniquesUsed":
                return <TechniquesUsed key={section.key} data={data} />;
              case "googleReviews":
                return <GoogleReviews key={section.key} data={data} />;
              case "trustpilotReviews":
                return <TrustpilotReviews key={section.key} data={data} />;
              case "faqs":
                return <Faqs key={section.key} data={data} />;
              default:
                return null;
            }
          })}
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
