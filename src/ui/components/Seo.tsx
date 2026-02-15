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
  image?: string;
}

export function Seo({
  title,
  description,
  path,
  type = "website",
  image,
}: SeoProps) {
  const fullTitle = path === "/" ? APP_NAME : `${title} | ${APP_NAME}`;
  const canonical = `${APP_URL}${path}`;
  const ogImage = image ?? `${APP_URL}/og-image.png`;

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
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={APP_TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
