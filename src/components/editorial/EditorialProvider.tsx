"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getAllExperiences } from "@/data/mock-experiences";
import type {
  EditorialRecord,
  WorkerDraft,
  ReplyDraft,
  EvidenceDocument,
} from "@/types/submission";
import { mayPublish, mayLinkDocument } from "@/lib/editorial-rules";
type EditorialContext = {
  enabled: boolean;
  records: EditorialRecord[];
  addWorker: (data: WorkerDraft) => string;
  addReply: (parentId: string, title: string, data: ReplyDraft) => string;
  review: (id: string, checked: boolean) => void;
  publish: (id: string) => boolean;
  reject: (id: string) => void;
  attach: (id: string, file: File, title: string) => void;
};
const Context = createContext<EditorialContext | null>(null);
export function EditorialProvider({
  children,
  enabled,
}: {
  children: React.ReactNode;
  enabled: boolean;
}) {
  const [records, setRecords] = useState<EditorialRecord[]>(() =>
    enabled
      ? getAllExperiences().map((e): EditorialRecord => ({
          id: e.id,
          kind: "complaint",
          title: e.title,
          narrative: e.content,
          city: e.city,
          staffType: e.staffType || "affiliate",
          sourcePath: "/deneyimler/" + e.slug,
          status: "published",
          evidenceReviewed: false,
          documents: [],
          createdAt: e.publishedAt,
          isSeed: true,
        }))
      : [],
  );
  const urls = useRef<string[]>([]);
  useEffect(
    () => () => urls.current.forEach((url) => URL.revokeObjectURL(url)),
    [],
  );
  const addWorker = (data: WorkerDraft) => {
    if (!enabled) return "";
    const id = crypto.randomUUID();
    setRecords((previous) => [
      {
        ...data,
        id,
        kind: "complaint",
        status: "awaiting_evidence",
        evidenceReviewed: false,
        documents: [],
        createdAt: new Date().toISOString(),
      },
      ...previous,
    ]);
    return id;
  };
  const addReply = (parentId: string, title: string, data: ReplyDraft) => {
    if (!enabled) return "";
    const id = crypto.randomUUID();
    setRecords((previous) => [
      {
        id,
        kind: "reply",
        parentId,
        title,
        narrative: data.reply,
        name: data.name,
        role: data.role,
        status: "awaiting_evidence",
        evidenceReviewed: false,
        documents: [],
        createdAt: new Date().toISOString(),
      },
      ...previous,
    ]);
    return id;
  };
  const review = (id: string, checked: boolean) => {
    if (enabled)
      setRecords((previous) =>
        previous.map((r) =>
          r.id === id
            ? {
                ...r,
                evidenceReviewed: checked,
                status:
                  r.status === "published"
                    ? r.status
                    : checked
                      ? "reviewing"
                      : "awaiting_evidence",
              }
            : r,
        ),
      );
  };
  const publish = (id: string) => {
    const record = records.find((r) => r.id === id);
    if (!enabled || !record || !mayPublish(record)) return false;
    setRecords((previous) =>
      previous.map((r) =>
        r.id === id && mayPublish(r) ? { ...r, status: "published" } : r,
      ),
    );
    return true;
  };
  const reject = (id: string) => {
    if (enabled)
      setRecords((previous) =>
        previous.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
      );
  };
  const attach = (id: string, file: File, title: string) => {
    if (!enabled) return;
    const target = records.find((r) => r.id === id);
    if (!target?.evidenceReviewed) return;
    const previewUrl = URL.createObjectURL(file);
    urls.current.push(previewUrl);
    const document: EvidenceDocument = {
      id: crypto.randomUUID(),
      recordId: id,
      title,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      storageKey: null,
      publicUrl: null,
      previewUrl,
      redacted: true,
      publicationApproved: true,
    };
    if (!mayLinkDocument(document)) return;
    setRecords((previous) =>
      previous.map((r) =>
        r.id === id ? { ...r, documents: [...r.documents, document] } : r,
      ),
    );
  };
  return (
    <Context.Provider
      value={{
        enabled,
        records,
        addWorker,
        addReply,
        review,
        publish,
        reject,
        attach,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useEditorial() {
  const value = useContext(Context);
  if (!value) throw new Error("EditorialProvider required");
  return value;
}
