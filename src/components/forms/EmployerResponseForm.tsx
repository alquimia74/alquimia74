"use client";
import { useState } from "react";
import { SubmissionReceipt } from "./SubmissionReceipt";
import { employerReplySchema } from "@/lib/validations";
import { config } from "@/lib/config";
import type { ReplyDraft } from "@/types/submission";
export function EmployerResponseForm({
  complaintId,
  complaintTitle,
}: {
  complaintId: string;
  complaintSlug?: string;
  complaintTitle: string;
}) {
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<ReplyDraft | null>(null),
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
        body: JSON.stringify({
          kind: "reply",
          parentId: complaintId,
          data: draft,
        }),
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
      <SubmissionReceipt kind="reply" title={complaintTitle} id={receipt} />
    );
  function preview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = employerReplySchema.safeParse(
      Object.fromEntries(new window.FormData(event.currentTarget)),
    );
    if (!result.success) {
      setError("Unvanınızı, adınızı ve yanıtınızı kontrol edin.");
      return;
    }
    setError("");
    setDraft(result.data);
    setPreviewing(true);
  }
  const evidence = (
    <p className="text-xs leading-6 text-muted">
      Yanıtınızın yayımlanması için somut belgelerinizi şikâyetin başlığını
      belirterek{" "}
      <a
        className="font-bold text-brand"
        href={
          "mailto:" +
          config.contactEmail +
          "?subject=" +
          encodeURIComponent("Yanıt belgeleri — " + complaintTitle)
        }
      >
        {config.contactEmail}
      </a>{" "}
      adresine gönderin. Belgesiz yanıt yayımlanmaz.
    </p>
  );
  if (draft && previewing)
    return (
      <section className="card submission-preview space-y-5 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-extrabold text-navy">Yanıt önizlemesi</h2>
          <button
            className="text-sm font-bold text-brand"
            onClick={() => setPreviewing(false)}
          >
            Düzenle
          </button>
        </div>
        <p className="text-sm font-semibold text-muted">
          {draft.name} · {draft.role}
        </p>
        <p className="whitespace-pre-wrap text-sm leading-7 text-ink">
          {draft.reply}
        </p>
        {evidence}
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <button className="btn btn-primary" disabled={sending} onClick={send}>
          {sending ? "Gönderiliyor…" : "Yanıtı gönder"}
        </button>
      </section>
    );
  return (
    <form
      onSubmit={preview}
      className="card submission-preview space-y-5 p-5 sm:p-7"
    >
      <label className="block text-sm font-bold text-navy">
        Görev / yetki unvanı
        <input
          name="role"
          className="input mt-2"
          defaultValue={draft?.role}
          minLength={2}
          maxLength={120}
          required
        />
      </label>
      <label className="block text-sm font-bold text-navy">
        Ad soyad
        <input
          name="name"
          className="input mt-2"
          defaultValue={draft?.name}
          minLength={2}
          maxLength={120}
          autoComplete="name"
          required
        />
      </label>
      <label className="block text-sm font-bold text-navy">
        Yanıtınız
        <textarea
          name="reply"
          className="input mt-2"
          defaultValue={draft?.reply}
          minLength={20}
          maxLength={5000}
          rows={7}
          required
        />
      </label>
      {evidence}
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
