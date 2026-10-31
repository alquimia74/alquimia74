import type { WorkerDraft, ReplyDraft } from "./submission";
export type ReviewStatus = "pending" | "published" | "rejected";
export interface AdminNote {
  id: string;
  text: string;
  url: string;
  public: boolean;
}
export interface ModerationRecord {
  id: string;
  slug: string;
  kind: "complaint" | "reply";
  parentId?: string;
  title: string;
  narrative: string;
  city?: WorkerDraft["city"];
  staffType?: WorkerDraft["staffType"];
  period?: string;
  role?: ReplyDraft["role"];
  name?: ReplyDraft["name"];
  status: ReviewStatus;
  evidenceReviewed: boolean;
  adminNotes: AdminNote[];
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
  version: number;
  isExample?: boolean;
}
export interface MusicTrack {
  id: string;
  videoId: string;
  title: string;
  startSeconds: number;
}
export interface MusicSettings {
  tracks: MusicTrack[];
}
