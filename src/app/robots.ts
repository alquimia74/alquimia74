import { MetadataRoute } from "next";
import { config } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  if (!config.publicIndexingEnabled) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      sitemap: undefined,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/demo/", "/admin", "/yonetim", "/onizleme/"],
      },
    ],
    sitemap: `${config.siteUrl}/sitemap.xml`,
  };
}
