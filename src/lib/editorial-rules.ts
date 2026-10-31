import type { EditorialRecord, EvidenceDocument } from "@/types/submission";
export function mayPublish(record: EditorialRecord): boolean {
  return (
    record.evidenceReviewed &&
    (record.status === "reviewing" || record.status === "awaiting_evidence")
  );
}
export function mayLinkDocument(document: EvidenceDocument): boolean {
  return document.redacted && document.publicationApproved;
}
