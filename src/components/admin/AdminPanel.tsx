"use client";
import { MusicEditor } from "./MusicEditor";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  RefreshCw,
  Plus,
  X,
  Inbox,
  CheckCircle2,
  Music2,
} from "lucide-react";
import { STAFF_LABELS } from "@/types/submission";
import { PROVINCES } from "@/data/provinces";
import type {
  ModerationRecord,
  MusicSettings,
  ReviewStatus,
} from "@/types/moderation";
type Tab = ReviewStatus | "music";
const labels = {
  pending: "Onay bekleyenler",
  published: "Yayında",
  rejected: "Reddedilenler",
};
export function AdminPanel({
  initialRecords,
  initialMusic,
}: {
  initialRecords: ModerationRecord[];
  initialMusic: MusicSettings;
}) {
  const [records, setRecords] = useState(initialRecords),
    [music, setMusic] = useState(initialMusic),
    [tab, setTab] = useState<Tab>("pending"),
    [selected, setSelected] = useState<ModerationRecord | null>(null),
    [message, setMessage] = useState("");
  const router = useRouter();
  async function refresh() {
    try {
      const response = await fetch("/api/admin/records", { cache: "no-store" });
      if (response.status === 401) {
        router.refresh();
        return;
      }
      if (!response.ok) throw Error();
      const data = await response.json();
      setRecords(data.records);
      setMusic(data.music);
    } catch {
      setMessage("Liste yenilenemedi. Tekrar deneyebilirsin.");
    }
  }
  useEffect(() => {
    const id = setInterval(() => {
      fetch("/api/admin/records", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) setRecords(data.records);
        })
        .catch(() => {});
    }, 30000);
    return () => clearInterval(id);
  }, []);
  async function logout() {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.refresh();
  }
  function saved(record: ModerationRecord) {
    setRecords((previous) =>
      previous.map((r) => (r.id === record.id ? record : r)),
    );
    setSelected(record);
    setMessage("Değişiklikler kaydedildi.");
  }
  const filtered = records.filter((r) => r.status === tab);
  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <p className="text-xs font-bold text-brand">yetişikayet.com</p>
            <h1 className="mt-1 text-xl font-extrabold text-navy">
              Yayın yönetimi
            </h1>
          </div>
          <button onClick={logout} className="btn btn-secondary btn-sm">
            <LogOut className="h-4 w-4" /> Çıkış yap
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-[1440px] p-5 sm:p-8">
        <nav
          aria-label="Yönetim bölümleri"
          className="mb-6 flex flex-wrap gap-2"
        >
          {(["pending", "published", "rejected"] as const).map((key) => (
            <button
              key={key}
              className="chip"
              data-active={tab === key}
              onClick={() => {
                setTab(key);
                setSelected(null);
                setMessage("");
              }}
            >
              {key === "pending" ? (
                <Inbox className="h-4 w-4" />
              ) : key === "published" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : null}
              {labels[key]}{" "}
              <span>({records.filter((r) => r.status === key).length})</span>
            </button>
          ))}
          <button
            className="chip"
            data-active={tab === "music"}
            onClick={() => {
              setTab("music");
              setSelected(null);
            }}
          >
            <Music2 className="h-4 w-4" /> Müzik
          </button>
          <button className="chip sm:ml-auto" onClick={refresh}>
            <RefreshCw className="h-4 w-4" /> Yenile
          </button>
        </nav>
        {message && (
          <p role="status" className="mb-5 text-sm font-semibold text-brand">
            {message}
          </p>
        )}
        {tab === "music" ? (
          <MusicEditor
            music={music}
            onSave={(value) => {
              setMusic(value);
              setMessage("Müzik güncellendi.");
            }}
          />
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="space-y-3" aria-label={labels[tab]}>
              {!filtered.length && (
                <div className="card p-6 text-sm text-muted">
                  Bu bölümde içerik bulunmuyor.
                </div>
              )}
              {filtered.map((record) => (
                <button
                  key={record.id}
                  className={
                    "card user-content w-full p-4 text-left transition-colors " +
                    (selected?.id === record.id
                      ? "!border-brand bg-brand-soft"
                      : "hover:!border-brand-line")
                  }
                  onClick={() => {
                    setSelected(record);
                    setMessage("");
                  }}
                >
                  <span
                    className={
                      "text-[11px] font-extrabold uppercase tracking-wide " +
                      (record.kind === "reply" ? "text-navy" : "text-brand")
                    }
                  >
                    {record.kind === "reply"
                      ? "Şikâyete yanıt geldi"
                      : "Çalışan şikâyeti"}
                    {record.isExample ? " · Örnek" : ""}
                  </span>
                  <p className="mt-2 text-sm font-bold leading-6 text-navy">
                    {record.title}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    {new Date(record.createdAt).toLocaleDateString("tr-TR")}
                    {record.kind === "reply"
                      ? " · " + record.name
                      : record.city
                        ? " · " + record.city
                        : ""}
                  </p>
                </button>
              ))}
            </aside>
            {selected ? (
              <RecordEditor
                key={selected.id + ":" + selected.version}
                record={selected}
                onSave={saved}
              />
            ) : (
              <section className="card p-8 text-sm text-muted">
                İncelemek veya düzenlemek için bir içerik seç.
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
function RecordEditor({
  record,
  onSave,
}: {
  record: ModerationRecord;
  onSave: (r: ModerationRecord) => void;
}) {
  const [draft, setDraft] = useState(record),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  function field<K extends keyof ModerationRecord>(
    key: K,
    value: ModerationRecord[K],
  ) {
    setDraft((previous) => ({ ...previous, [key]: value }));
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const action = (event.nativeEvent as SubmitEvent).submitter?.getAttribute(
      "value",
    );
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/records", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          status: action || draft.status,
          adminNotes: draft.adminNotes.filter(
            (n) => n.text.trim() || n.url.trim(),
          ),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      onSave(data.record);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kayıt kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      onSubmit={save}
      className="card user-content min-w-0 space-y-5 p-5 sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-extrabold text-navy">
          {record.kind === "complaint"
            ? "Şikâyeti düzenle"
            : "İşveren yanıtını düzenle"}
        </h2>
        <span className="text-xs font-semibold text-muted">
          {labels[record.status]}
        </span>
      </div>
      <p className="text-xs text-muted">Başvuru: {record.id}</p>
      {record.kind === "reply" && (
        <p className="rounded-lg bg-page p-3 text-sm text-muted">
          İlgili şikâyet: <strong>{record.title}</strong>
        </p>
      )}
      {record.kind === "complaint" ? (
        <>
          <label className="field-label">
            Başlık
            <input
              className="input mt-2"
              value={draft.title}
              onChange={(e) => field("title", e.target.value)}
              minLength={10}
              maxLength={120}
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field-label">
              İl
              <select
                className="input mt-2"
                value={draft.city || ""}
                onChange={(e) => field("city", e.target.value)}
                required
              >
                {PROVINCES.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </label>
            <label className="field-label">
              Kadro
              <select
                className="input mt-2"
                value={draft.staffType}
                onChange={(e) =>
                  field(
                    "staffType",
                    e.target.value as "affiliate" | "headquarters",
                  )
                }
              >
                {Object.entries(STAFF_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="field-label">
            Çalışma dönemi
            <input
              className="input mt-2"
              value={draft.period || ""}
              onChange={(e) => field("period", e.target.value)}
              maxLength={100}
            />
          </label>
        </>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field-label">
            Ad soyad
            <input
              className="input mt-2"
              value={draft.name || ""}
              onChange={(e) => field("name", e.target.value)}
              minLength={2}
              maxLength={120}
              required
            />
          </label>
          <label className="field-label">
            Yetki unvanı
            <input
              className="input mt-2"
              value={draft.role || ""}
              onChange={(e) => field("role", e.target.value)}
              minLength={2}
              maxLength={120}
              required
            />
          </label>
        </div>
      )}
      <label className="field-label">
        {record.kind === "complaint" ? "Şikâyet metni" : "Yanıt metni"}
        <textarea
          className="input mt-2"
          rows={9}
          value={draft.narrative}
          onChange={(e) => field("narrative", e.target.value)}
          minLength={record.kind === "complaint" ? 100 : 20}
          maxLength={5000}
          required
        />
      </label>
      <label className="flex items-start gap-3 rounded-lg border border-brand-line bg-brand-soft/50 p-4 text-sm leading-6">
        <input
          className="mt-1"
          type="checkbox"
          checked={draft.evidenceReviewed}
          onChange={(e) => field("evidenceReviewed", e.target.checked)}
        />
        E-postayla gelen somut belgeleri inceledim; içerikle uyumlu olduğunu
        doğruladım.
      </label>
      <section className="space-y-3 border-t border-line pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-extrabold text-navy">
            Admin notları ve belgeler
          </h3>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={draft.adminNotes.length >= 20}
            onClick={() =>
              field("adminNotes", [
                ...draft.adminNotes,
                { id: crypto.randomUUID(), text: "", url: "", public: true },
              ])
            }
          >
            <Plus className="h-4 w-4" /> Not ekle
          </button>
        </div>
        {draft.adminNotes.map((note, index) => (
          <div
            className="space-y-3 rounded-xl border border-line p-4"
            key={note.id}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted">
                Not {index + 1}
              </span>
              <button
                type="button"
                aria-label={"Not " + (index + 1) + " sil"}
                onClick={() =>
                  field(
                    "adminNotes",
                    draft.adminNotes.filter((n) => n.id !== note.id),
                  )
                }
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <label className="field-label">
              Not metni
              <textarea
                className="input mt-2"
                rows={3}
                maxLength={3000}
                value={note.text}
                onChange={(e) =>
                  field(
                    "adminNotes",
                    draft.adminNotes.map((n) =>
                      n.id === note.id ? { ...n, text: e.target.value } : n,
                    ),
                  )
                }
              />
            </label>
            <label className="field-label">
              Belge bağlantısı{" "}
              <span className="field-hint">(isteğe bağlı)</span>
              <input
                type="url"
                placeholder="https://…"
                className="input mt-2"
                maxLength={2000}
                value={note.url}
                onChange={(e) =>
                  field(
                    "adminNotes",
                    draft.adminNotes.map((n) =>
                      n.id === note.id ? { ...n, url: e.target.value } : n,
                    ),
                  )
                }
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={note.public}
                onChange={(e) =>
                  field(
                    "adminNotes",
                    draft.adminNotes.map((n) =>
                      n.id === note.id ? { ...n, public: e.target.checked } : n,
                    ),
                  )
                }
              />{" "}
              Sitede göster
            </label>
          </div>
        ))}
      </section>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3 border-t border-line pt-5">
        <button className="btn btn-primary" disabled={busy}>
          Değişiklikleri kaydet
        </button>
        {draft.status !== "published" && (
          <button
            className="btn btn-navy"
            name="action"
            value="published"
            disabled={busy}
          >
            Onayla ve yayımla
          </button>
        )}
        {draft.status === "published" && (
          <button
            className="btn btn-secondary"
            name="action"
            value="pending"
            disabled={busy}
          >
            Yayından al
          </button>
        )}
        {draft.status !== "rejected" && (
          <button
            className="btn btn-secondary"
            name="action"
            value="rejected"
            disabled={busy}
          >
            Reddet
          </button>
        )}
      </div>
    </form>
  );
}
