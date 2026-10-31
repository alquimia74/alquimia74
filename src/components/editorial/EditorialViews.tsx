"use client";
import Link from "next/link";
import { useEditorial } from "./EditorialProvider";
import { STAFF_LABELS, type EvidenceDocument } from "@/types/submission";
import { mayLinkDocument } from "@/lib/editorial-rules";
import { EmployerResponseForm } from "@/components/forms/EmployerResponseForm";
export function PreviewDocuments({
  documents,
}: {
  documents: EvidenceDocument[];
}) {
  const { enabled } = useEditorial();
  if (!enabled) return null;
  const visible = documents.filter(
    (d) => mayLinkDocument(d) && d.previewUrl?.startsWith("blob:"),
  );
  return visible.length ? (
    <div className="mt-4 border-t border-line pt-3">
      <p className="text-xs font-bold text-subtle">Paylaşılan belgeler</p>
      <ul className="mt-2 space-y-2">
        {visible.map((d) => (
          <li key={d.id}>
            <a
              className="text-sm font-bold text-brand underline"
              href={d.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {d.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
}
export function EditorialAdditions({ recordId }: { recordId: string }) {
  const { enabled, records } = useEditorial();
  if (!enabled) return null;
  const parent = records.find((r) => r.id === recordId);
  const replies = records.filter(
    (r) =>
      r.kind === "reply" && r.parentId === recordId && r.status === "published",
  );
  return (
    <>
      {parent?.status === "published" && (
        <PreviewDocuments documents={parent.documents} />
      )}
      {replies.map((reply) => (
        <section key={reply.id} className="card my-4 p-5">
          <h2 className="font-extrabold text-navy">
            İşveren yanıtı{" "}
            <span className="text-xs font-normal text-subtle">· Önizleme</span>
          </h2>
          <p className="mt-2 text-xs text-subtle">
            {reply.name} · {reply.role}
          </p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink">
            {reply.narrative}
          </p>
          <PreviewDocuments documents={reply.documents} />
        </section>
      ))}
    </>
  );
}
export function PreviewPublishedFeed({ query = "" }: { query?: string }) {
  const { enabled, records } = useEditorial();
  if (!enabled) return null;
  const q = query.toLocaleLowerCase("tr-TR");
  const list = records.filter(
    (r) =>
      r.kind === "complaint" &&
      !r.isSeed &&
      r.status === "published" &&
      (!q ||
        (r.title + " " + r.narrative + " " + r.city)
          .toLocaleLowerCase("tr-TR")
          .includes(q)),
  );
  return list.length ? (
    <div className="mb-4 grid gap-4 md:grid-cols-2">
      {list.map((r) => (
        <article key={r.id} className="card p-5">
          <p className="text-xs font-bold text-brand">
            Yönetimden onaylanan önizleme
          </p>
          <h2 className="mt-3 text-lg font-extrabold text-navy">
            <Link href={"/onizleme/" + r.id}>{r.title}</Link>
          </h2>
          <p className="mt-2 text-xs text-muted">
            {r.city} · {r.staffType ? STAFF_LABELS[r.staffType] : ""}
          </p>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
            {r.narrative}
          </p>
          <PreviewDocuments documents={r.documents} />
          <Link className="link-more mt-3" href={"/onizleme/" + r.id}>
            Kaydı aç
          </Link>
        </article>
      ))}
    </div>
  ) : null;
}
export function PreviewThread({ id }: { id: string }) {
  const { enabled, records } = useEditorial();
  const record = records.find(
    (r) => r.id === id && r.kind === "complaint" && r.status === "published",
  );
  if (!enabled || !record)
    return (
      <div className="container-main py-12">
        <h1 className="text-xl font-bold text-navy">
          Bu önizleme kaydı bulunamadı.
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sayfa yenilendiyse geçici kayıtlar silinmiştir.
        </p>
      </div>
    );
  return (
    <div className="container-main py-8">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs font-bold text-brand">
          Geçici yayın önizlemesi
        </p>
        <article className="card p-6">
          <h1 className="text-2xl font-extrabold text-navy">{record.title}</h1>
          <p className="mt-3 text-sm text-muted">
            {record.city} ·{" "}
            {record.staffType ? STAFF_LABELS[record.staffType] : ""}
            {record.period ? " · " + record.period : ""}
          </p>
          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-ink">
            {record.narrative}
          </p>
        </article>
        <EditorialAdditions recordId={record.id} />
        <section className="mt-6" id="yanit">
          <h2 className="mb-3 font-extrabold text-navy">İşveren yanıtı</h2>
          <EmployerResponseForm
            complaintId={record.id}
            complaintTitle={record.title}
          />
        </section>
      </div>
    </div>
  );
}
