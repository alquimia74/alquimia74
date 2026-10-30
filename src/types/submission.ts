export type SubmissionStatus = "draft" | "submitted" | "reviewing" | "published" | "rejected";

export interface Submission {
  id?: string;
  entity: string;
  contractualEmployer?: string;
  employmentStart: string;
  employmentEnd?: string;
  role?: string;
  employmentStatus: "former" | "current" | "other";
  city?: string;
  title: string;
  narrative: string;
  approximateDates?: string;
  publishPreference: "alias" | "name_allowed" | "editor_only";
  status: SubmissionStatus;
  submittedAt?: string;
}
