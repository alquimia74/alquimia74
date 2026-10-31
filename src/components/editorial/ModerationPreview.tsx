"use client";
import { useState } from "react";
import Link from "next/link";
import { useEditorial } from "./EditorialProvider";
import { STAFF_LABELS } from "@/types/submission";
import { checkEvidenceFile } from "@/lib/security";
import { mayPublish } from "@/lib/editorial-rules";
import { PreviewDocuments } from "./EditorialViews";
const labels = {
  awaiting_evidence: "Belge bekliyor",
  reviewing: "İncelemede",
  published: "Yayında",
  rejected: "Reddedildi",
};
export function ModerationPreview() {
  const editorial = useEditorial();
  const [selected, setSelected] = useState(""),
    [error, setError] = useState("");
  const record = editorial.records.find((r) => r.id === selected);
  const [file, setFile] = useState<File | null>(null),
    [title, setTitle] = useState(""),
    [redacted, setRedacted] = useState(false),
    [permission, setPermission] = useState(false);
  function select(id: string) {
    setSelected(id);
    setFile(null);
    setTitle("");
    setRedacted(false);
    setPermission(false);
    setError("");
  }
  async function attach(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !record ||
      !file ||
      !record.evidenceReviewed ||
      !redacted ||
      !permission
    ) {
      setError(
        "İnceleme, kişisel bilgi gizleme ve paylaşım yetkisi kontrolünü tamamlayın.",
      );
      return;
    }
    const issue = await checkEvidenceFile(
      file,
      record.documents.map((d) => ({ size: d.size }) as File),
    );
    if (issue) {
      setError(issue);
      return;
    }
    if (title.trim().length < 3) {
      setError("Bağlantı başlığı en az 3 karakter olmalı.");
      return;
    }
    editorial.attach(record.id, file, title.trim());
    setFile(null);
    setTitle("");
    setRedacted(false);
    setPermission(false);
    setError("");
  }
  return (
    <div className="container-main py-8">
      <h1 className="text-2xl font-black text-navy">Yönetim önizlemesi</h1>
      <p className="mt-3 rounded-lg bg-navy-soft p-4 text-sm leading-6 text-muted">
        Yalnızca geliştirme ortamında açıktır. Kayıtlar ve belgeler bu sekmede
        geçicidir; yenilemede silinir. Gerçek giriş, veritabanı veya başvuru
        kaydı yoktur.
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-3">
          {editorial.records.map((r) => (
            <button
              type="button"
              key={r.id}
              onClick={() => select(r.id)}
              className={
                "card w-full p-4 text-left " +
                (selected === r.id ? "!border-brand" : "")
              }
            >
              <span className="text-xs font-bold text-brand">
                {r.kind === "reply" ? "İşveren yanıtı" : "Çalışan şikâyeti"}
                {r.isSeed ? " · Örnek" : ""}
              </span>
              <span className="mt-2 block text-sm font-bold text-navy">
                {r.title}
              </span>
              <span className="mt-2 block text-xs text-muted">
                {labels[r.status]}
              </span>
            </button>
          ))}
        </aside>
        <section>
          {record ? (
            <div className="card space-y-5 p-5 sm:p-7">
              <div>
                <p className="text-xs text-subtle">{record.id}</p>
                <h2 className="mt-2 text-xl font-extrabold text-navy">
                  {record.title}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  {record.kind === "complaint"
                    ? [
                        record.city,
                        record.staffType ? STAFF_LABELS[record.staffType] : "",
                        record.period,
                      ]
                        .filter(Boolean)
                        .join(" · ")
                    : [record.name, record.role].join(" · ")}
                </p>
              </div>
              <p className="whitespace-pre-line text-sm leading-7 text-ink">
                {record.narrative}
              </p>
              <label className="flex items-start gap-3 rounded-lg bg-page p-4 text-sm leading-6">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={record.evidenceReviewed}
                  onChange={(e) =>
                    editorial.review(record.id, e.target.checked)
                  }
                />
                Başlıkla eşleşen e-posta belgeleri ve içerik incelendi; yayın
                için somut dayanak yeterli.
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  className="btn btn-primary"
                  disabled={!mayPublish(record)}
                  onClick={() => {
                    if (!editorial.publish(record.id))
                      setError(
                        "Belge incelemesi tamamlanmadan onay verilemez.",
                      );
                  }}
                >
                  Onayla ve yayımla
                </button>
                <button
                  className="btn btn-secondary"
                  disabled={record.isSeed}
                  onClick={() => editorial.reject(record.id)}
                >
                  Reddet / Yayından çek
                </button>
                <Link
                  className="btn btn-secondary"
                  href={
                    record.isSeed
                      ? "/deneyimler/" +
                        (record.id === "exp-001"
                          ? "ucret-odemelerinde-gecikme-yasanan-donem"
                          : "sgk-kaydinda-farklilika-iliskin-anlatim")
                      : record.kind === "reply"
                        ? "/"
                        : "/onizleme/" + record.id
                  }
                >
                  Yayını gör
                </Link>
              </div>
              <form
                className="space-y-4 border-t border-line pt-5"
                onSubmit={attach}
              >
                <h3 className="font-extrabold text-navy">
                  Bu {record.kind === "reply" ? "yanıta" : "şikâyete"} belge
                  ekle
                </h3>
                <label className="block text-sm">
                  Bağlantı başlığı
                  <input
                    className="input mt-2"
                    required
                    minLength={3}
                    maxLength={120}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
                <label className="block text-sm">
                  Belge
                  <input
                    className="mt-2 block w-full text-sm"
                    key={record.id + "-" + record.documents.length}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
                <label className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={redacted}
                    onChange={(e) => setRedacted(e.target.checked)}
                  />
                  Kişisel bilgiler gizlendi.
                </label>
                <label className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={permission}
                    onChange={(e) => setPermission(e.target.checked)}
                  />
                  Bu kopya için paylaşım yetkisi kontrol edildi.
                </label>
                <button
                  className="btn btn-secondary"
                  disabled={
                    !record.evidenceReviewed ||
                    !file ||
                    !redacted ||
                    !permission
                  }
                  type="submit"
                >
                  Belge bağlantısını ekle
                </button>
              </form>
              <PreviewDocuments documents={record.documents} />
              {error && (
                <p role="alert" className="text-sm text-red-700">
                  {error}
                </p>
              )}
            </div>
          ) : (
            <div className="card p-8 text-sm text-muted">
              İncelemek için bir kayıt seç.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
