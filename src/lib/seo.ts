import { type Metadata } from "next";
import { config } from "./config";

interface GenerateMetaOptions {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
  ogImageUrl?: string;
}

export function generateMeta({
  title,
  description,
  path = "",
  noindex,
  ogImageUrl,
}: GenerateMetaOptions): Metadata {
  const url = `${config.siteUrl}${path}`;
  const shouldIndex = config.publicIndexingEnabled && !noindex;
  const robots = shouldIndex ? "index, follow" : "noindex, nofollow";
  const image = ogImageUrl ?? `${config.siteUrl}${config.defaultOgImage}`;

  return {
    title,
    description,
    metadataBase: new URL(config.siteUrl),
    alternates: { canonical: url },
    robots,
    openGraph: {
      title,
      description,
      url,
      siteName: config.siteName,
      locale: "tr_TR",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
