import { Helmet } from "react-helmet-async";
import { APP_NAME, APP_URL, APP_DESCRIPTION } from "../../config/constants.ts";

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: APP_NAME,
    url: APP_URL,
    description: APP_DESCRIPTION,
    applicationCategory: "Science",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
