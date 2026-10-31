export type StaffType = "affiliate" | "headquarters";
export const STAFF_LABELS: Record<StaffType, string> = {
  affiliate: "İştirak çalışanı",
  headquarters: "Merkez kadro çalışanı",
};
export interface WorkerDraft {
  title: string;
  narrative: string;
  city: string;
  staffType: StaffType;
  period?: string;
}
export interface ReplyDraft {
  role: string;
  name: string;
  reply: string;
}
export type SubmissionStatus =
  "awaiting_evidence" | "reviewing" | "published" | "rejected";
/** A future persisted document record. Binary storage is NOT implemented. */
export interface EvidenceDocument {
  id: string;
  recordId: string;
  title: string;
  filename: string;
  mimeType: string;
  size: number;
  storageKey: string | null;
  publicUrl: string | null;
  previewUrl?: string;
  redacted: boolean;
  publicationApproved: boolean;
}
export interface EditorialRecord {
  id: string;
  kind: "complaint" | "reply";
  parentId?: string;
  title: string;
  narrative: string;
  city?: string;
  staffType?: StaffType;
  period?: string;
  role?: string;
  name?: string;
  status: SubmissionStatus;
  evidenceReviewed: boolean;
  documents: EvidenceDocument[];
  createdAt: string;
  isSeed?: boolean;
  sourcePath?: string;
}
export type Submission = WorkerDraft & {
  id?: string;
  status: SubmissionStatus;
};
