import { MetadataRoute } from "next";
import { config } from "@/lib/config";
import { getAllEntities } from "@/data/mock-entities";
import { getAllExperiences } from "@/lib/server/experiences";

// Mock deneyimler, admin demo ve özel alanlar sitemap'e dahil edilmez
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = config.siteUrl;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date("2026-10-31T00:00:00Z"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/deneyimler`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/kurumlar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/nasil-calisir`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/yayin-ilkeleri`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/sikca-sorulan-sorular`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/iletisim`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${base}/gizlilik`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${base}/kvkk-aydinlatma`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Yalnızca içerik barındıran kurum sayfaları
  const entityPages: MetadataRoute.Sitemap = getAllEntities()
    .filter((e) => e.hasContent)
    .map((e) => ({
      url: `${base}/kurumlar/${e.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const complaintPages: MetadataRoute.Sitemap = (await getAllExperiences())
    .filter((e) => !e.isExample)
    .map((e) => ({
      url: base + "/deneyimler/" + e.slug,
      lastModified: new Date(e.publishedAt),
      priority: 0.8,
    }));
  return [...staticPages, ...entityPages, ...complaintPages];
}
