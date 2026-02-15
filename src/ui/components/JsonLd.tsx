import { Helmet } from "react-helmet-async";
import {
  APP_NAME,
  APP_URL,
  APP_DESCRIPTION,
  ROUTES,
} from "../../config/constants.ts";

interface JsonLdProps {
  page?: "home" | "map" | "sources" | "methodology";
}

export function JsonLd({ page = "home" }: JsonLdProps) {
  const graphs: object[] = [
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      name: APP_NAME,
      url: APP_URL,
      description: APP_DESCRIPTION,
      inLanguage: "en-US",
    },
    {
      "@type": "WebApplication",
      "@id": `${APP_URL}/#app`,
      name: APP_NAME,
      url: APP_URL,
      description: APP_DESCRIPTION,
      applicationCategory: "Science",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "SiteNavigationElement",
      "@id": `${APP_URL}/#nav`,
      name: ROUTES.map((r) => r.label),
      url: ROUTES.map((r) => `${APP_URL}${r.path}`),
    },
  ];

  if (page === "home" || page === "map") {
    graphs.push({
      "@type": "Dataset",
      "@id": `${APP_URL}/#dataset`,
      name: "Recent Earthquake Events",
      description:
        "Aggregated earthquake data from USGS and EMSC, updated every 5 minutes.",
      license: "https://creativecommons.org/publicdomain/zero/1.0/",
      creator: {
        "@type": "Organization",
        name: APP_NAME,
        url: APP_URL,
      },
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${APP_URL}/data/latest.json`,
      },
    });
  }

  if (page === "sources") {
    graphs.push({
      "@type": "AboutPage",
      "@id": `${APP_URL}/sources#page`,
      name: "Data Sources",
      url: `${APP_URL}/sources`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: [
          {
            "@type": "Organization",
            name: "USGS Earthquake Hazards Program",
            url: "https://earthquake.usgs.gov/",
          },
          {
            "@type": "Organization",
            name: "European-Mediterranean Seismological Centre (EMSC)",
            url: "https://www.emsc-csem.org/",
          },
        ],
      },
    });
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": graphs,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
