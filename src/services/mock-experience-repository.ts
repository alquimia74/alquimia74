import { type Experience } from "@/types/experience";
import {
  getAllExperiences,
  getExperienceBySlug,
  getExperiencesByEntity,
  searchExperiences,
} from "@/data/mock-experiences";

/**
 * Mock Experience Repository
 * Bu servis ileride Supabase repository ile değiştirilecektir.
 * Tüm metotlar aynı interface'i korur.
 */
export const mockExperienceRepository = {
  findAll: (): Experience[] => getAllExperiences(),
  findBySlug: (slug: string): Experience | undefined => getExperienceBySlug(slug),
  findByEntity: (entitySlug: string) => getExperiencesByEntity(entitySlug),
  search: (query: string) => searchExperiences(query),
};
