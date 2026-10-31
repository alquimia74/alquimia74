"use client";
import { useState } from "react";
import { SubmissionReceipt } from "./SubmissionReceipt";
import { workerSubmissionSchema } from "@/lib/validations";
import { config } from "@/lib/config";
import { STAFF_LABELS, type WorkerDraft } from "@/types/submission";
import { ProvincePicker } from "./ProvincePicker";
export function SubmissionForm() {
  const [city, setCity] = useState(""),
    [error, setError] = useState("");
  const [draft, setDraft] = useState<WorkerDraft | null>(null),
    [previewing, setPreviewing] = useState(false);
  const [receipt, setReceipt] = useState(""),
    [sending, setSending] = useState(false);
  async function send() {
    if (!draft || sending) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "complaint", data: draft }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      setReceipt(data.id);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Başvuru kaydedilemedi. Tekrar dene.",
      );
    } finally {
      setSending(false);
    }
  }
  if (receipt)
    return (
      <SubmissionReceipt
        kind="complaint"
        title={draft?.title || "Şikâyet"}
        id={receipt}
      />
    );
  function preview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = workerSubmissionSchema.safeParse({
      ...Object.fromEntries(new window.FormData(event.currentTarget)),
      city,
    });
    if (!result.success) {
      setError(
        "Başlığı, anlatımını, çalıştığın ili ve kadro türünü kontrol et.",
      );
      return;
    }
    setError("");
    setDraft(result.data);
    setPreviewing(true);
  }
  if (draft && previewing)
    return (
      <div className="card submission-preview space-y-5 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-extrabold text-navy">Şikâyet önizlemesi</h2>
          <button
            className="text-sm font-bold text-brand"
            onClick={() => setPreviewing(false)}
          >
            Düzenle
          </button>
        </div>
        <h3 className="text-lg font-bold text-navy">{draft.title}</h3>
        <p className="text-xs font-semibold text-muted">
          {draft.city} · {STAFF_LABELS[draft.staffType]}
          {draft.period ? " · " + draft.period : ""}
        </p>
        <p className="whitespace-pre-wrap text-sm leading-7 text-ink">
          {draft.narrative}
        </p>
        <p className="border-t border-line pt-4 text-sm leading-6 text-muted">
          Yayımlanması için belgelerini{" "}
          <strong>şikâyet başlığını belirterek</strong>{" "}
          <a
            className="font-bold text-brand"
            href={
              "mailto:" +
              config.contactEmail +
              "?subject=" +
              encodeURIComponent(draft.title)
            }
          >
            {config.contactEmail}
          </a>{" "}
          adresine gönder. İnceleyip onayladıktan sonra yayımlayalım.
        </p>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <button className="btn btn-primary" disabled={sending} onClick={send}>
          {sending ? "Gönderiliyor…" : "Şikâyeti gönder"}
        </button>
      </div>
    );
  return (
    <form
      onSubmit={preview}
      className="card submission-preview space-y-5 p-5 sm:p-7"
    >
      <label className="block text-sm font-bold text-navy">
        Başlık
        <input
          className="input mt-2"
          name="title"
          defaultValue={draft?.title}
          minLength={10}
          maxLength={120}
          required
          placeholder="Yaşadığın sorunu kısaca özetle"
        />
      </label>
      <label className="block text-sm font-bold text-navy">
        Ne yaşadın?
        <textarea
          className="input mt-2"
          name="narrative"
          defaultValue={draft?.narrative}
          rows={7}
          minLength={100}
          maxLength={5000}
          required
          placeholder="Olayı, önemli tarihleri ve varsa tutarları anlat."
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <ProvincePicker value={city} onChange={setCity} />
        <label className="block text-sm font-bold text-navy">
          Çalışma dönemi{" "}
          <span className="font-normal text-subtle">(isteğe bağlı)</span>
          <input
            className="input mt-2"
            name="period"
            defaultValue={draft?.period}
            maxLength={100}
            placeholder="Örn. Ocak–Haziran 2025"
          />
        </label>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-bold text-navy">Kadro türü</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(STAFF_LABELS).map(([value, label]) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-lg border border-line p-3 text-sm"
            >
              <input
                type="radio"
                name="staffType"
                value={value}
                defaultChecked={draft?.staffType === value}
                required
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <p className="text-xs leading-6 text-muted">
        Belgeler formdan yüklenmez. Şikâyet başlığını belirterek{" "}
        <a
          href={"mailto:" + config.contactEmail}
          className="font-bold text-brand"
        >
          {config.contactEmail}
        </a>{" "}
        adresine gönder. Belgesiz içerik yayımlanmaz.
      </p>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <button className="btn btn-primary" type="submit">
        Önizle
      </button>
    </form>
  );
}
