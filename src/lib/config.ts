/** Canonical identity shared by metadata, structured data and sitemap. */
export const config = {
  contactEmail: "yetisikayet@proton.me",
  musicVideoId: "5ftitAfWgWI",
  siteUrl: new URL("https://yetişikayet.com").origin,
  siteName: "yetişikayet.com",
  siteSlogan: "Yaşananlar, belgeleriyle.",
  publicIndexingEnabled:
    process.env.NODE_ENV === "production" &&
    process.env.PUBLIC_INDEXING_ENABLED === "true",
  defaultOgImage: "/opengraph-image",
} as const;
