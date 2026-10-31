import type { AdminNote } from "./moderation";
import type { WorkerDraft } from "./submission";

export interface Experience extends Partial<
  Pick<WorkerDraft, "city" | "staffType" | "period">
> {
  adminNotes?: AdminNote[];
  employerResponses?: {
    id: string;
    body: string;
    name: string;
    role: string;
    publishedAt: string;
    adminNotes: AdminNote[];
  }[];
  id: string;
  isExample?: boolean;
  evidenceStatus?: "reviewed";
  documents?: {
    title: string;
    url: string;
    redacted?: boolean;
    publicationApproved?: boolean;
  }[];
  employerResponse?: {
    body: string;
    company: string;
    publishedAt: string;
    reviewed: boolean;
  };
  slug: string;
  title: string;
  summary: string;
  content: string;
  relatedEntity: string;
  entitySlug: string;
  publishedAt: string;
}
