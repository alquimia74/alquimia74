import "server-only";
import { connection } from "next/server";
import { publishedRecords } from "./store";
import { supabaseConfigured } from "./supabase";
import { mockExperiences } from "@/data/mock-experiences";
import type { Experience } from "@/types/experience";
import type { ModerationRecord } from "@/types/moderation";
function toExperience(
  r: ModerationRecord,
  all: ModerationRecord[],
): Experience {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    summary: r.narrative,
    content: r.narrative,
    city: r.city,
    staffType: r.staffType,
    period: r.period,
    relatedEntity: "Yetiş+ Çarşı",
    entitySlug: "yetis-carsi",
    publishedAt: r.publishedAt || r.createdAt,
    isExample: r.isExample,
    evidenceStatus: r.evidenceReviewed ? "reviewed" : undefined,
    adminNotes: r.adminNotes.filter((n) => n.public),
    employerResponses: all
      .filter((x) => x.kind === "reply" && x.parentId === r.id)
      .map((x) => ({
        id: x.id,
        body: x.narrative,
        name: x.name || "",
        role: x.role || "",
        publishedAt: x.publishedAt || x.createdAt,
        adminNotes: x.adminNotes.filter((n) => n.public),
      })),
  };
}
export async function getAllExperiences(): Promise<Experience[]> {
  await connection();
  // Local design preview only. A configured remote database never falls back to mocks.
  if (!supabaseConfigured())
    return process.env.NODE_ENV === "development" ? mockExperiences : [];
  const all = await publishedRecords();
  return all
    .filter((r) => r.kind === "complaint")
    .map((r) => toExperience(r, all));
}
export async function getExperienceBySlug(
  slug: string,
): Promise<Experience | undefined> {
  await connection();
  if (!supabaseConfigured())
    return process.env.NODE_ENV === "development"
      ? mockExperiences.find((e) => e.slug === slug)
      : undefined;
  const all = await publishedRecords(slug),
    record = all.find((r) => r.kind === "complaint" && r.slug === slug);
  return record ? toExperience(record, all) : undefined;
}
export async function getExperiencesByEntity(slug: string) {
  return slug === "yetis-carsi" ? getAllExperiences() : [];
}
