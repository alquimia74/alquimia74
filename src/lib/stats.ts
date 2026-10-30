import { getAllExperiences } from "@/data/mock-experiences";
import { getAllEntities } from "@/data/mock-entities";
import { type Experience } from "@/types/experience";

export function sortByNewest(list: Experience[]): Experience[] {
  return [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Kurumları deneyim sayısına göre sıralar */
export function getEntityRanking() {
  const exps = getAllExperiences();
  return getAllEntities()
    .map((entity) => ({ entity, count: exps.filter((e) => e.entitySlug === entity.slug).length }))
    .sort((a, b) => b.count - a.count);
}

export function getPlatformStats() {
  const exps = getAllExperiences();
  return {
    experiences: exps.length,
    entities: getAllEntities().length,
    cities: new Set(exps.map((e) => e.city).filter(Boolean)).size,
  };
}
