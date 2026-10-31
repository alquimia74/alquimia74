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
  const url = new URL(path || "/", config.siteUrl).href;
  const pageTitle = title.includes(config.siteName)
    ? title
    : `${title} | ${config.siteName}`;
  const shouldIndex = config.publicIndexingEnabled && !noindex;
  const robots = shouldIndex ? "index, follow" : "noindex, nofollow";
  const image = ogImageUrl ?? `${config.siteUrl}${config.defaultOgImage}`;

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(config.siteUrl),
    applicationName: config.siteName,
    icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
    alternates: { canonical: url },
    robots,
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: config.siteName,
      locale: "tr_TR",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: pageTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image],
    },
  };
}
