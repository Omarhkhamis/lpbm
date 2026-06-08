"use client";

import CombinedReviews from "../../../../components/CombinedReviews";
import {
  googleReviewsDefaults,
  trustpilotReviewsDefaults
} from "../../../../../../lib/sectionDefaultsHollywood";

export default function GoogleReviews({
  data,
  trustpilotData,
  whatsappLink,
  locale = "en"
}) {
  return (
    <CombinedReviews
      data={data}
      trustpilotData={trustpilotData}
      googleDefaults={googleReviewsDefaults}
      trustpilotDefaults={trustpilotReviewsDefaults}
      whatsappLink={whatsappLink}
      locale={locale}
      trackingName="hollywood_smile_combined_reviews_cta"
    />
  );
}
