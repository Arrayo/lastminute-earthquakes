import { Helmet } from "react-helmet-async";
import {
  APP_NAME,
  APP_URL,
  APP_LOCALE,
  APP_TWITTER_HANDLE,
} from "../../config/constants.ts";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  type?: string;
}

export function Seo({
  title,
  description,
  path,
  type = "website",
}: SeoProps) {
  const fullTitle = `${title} | ${APP_NAME}`;
  const canonical = `${APP_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={APP_LOCALE} />
      <meta property="og:site_name" content={APP_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={APP_TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
