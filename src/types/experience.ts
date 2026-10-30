export interface Experience {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  relatedEntity: string;
  entitySlug: string;
  employmentStart: string;
  employmentEnd?: string;
  publishedAt: string;
  role?: string;
  city?: string;
}
