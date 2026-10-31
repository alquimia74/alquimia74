"use client";
import { useState } from "react";
import { ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";
import type { MusicSettings } from "@/types/moderation";
type TrackInput = {
  id: string;
  title: string;
  url: string;
  startSeconds: number;
};
export function MusicEditor({
  music,
  onSave,
}: {
  music: MusicSettings;
  onSave: (m: MusicSettings) => void;
}) {
  const [tracks, setTracks] = useState<TrackInput[]>(() =>
    music.tracks.map((t) => ({
      id: t.id,
      title: t.title,
      url: "https://www.youtube.com/watch?v=" + t.videoId,
      startSeconds: t.startSeconds,
    })),
  );
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  function update(id: string, changes: Partial<TrackInput>) {
    setTracks((previous) =>
      previous.map((t) => (t.id === id ? { ...t, ...changes } : t)),
    );
  }
  function move(index: number, direction: number) {
    setTracks((previous) => {
      const next = [...previous];
      const target = index + direction;
      if (target < 0 || target >= next.length) return previous;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracks }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      onSave(data.music);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Çalma listesi kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      className="card user-content max-w-3xl space-y-5 p-5 sm:p-7"
      onSubmit={save}
    >
      <div>
        <h2 className="text-lg font-extrabold text-navy">Çalma listesi</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Ziyaretçi oynat düğmesine bastığında ilk parça başlar. Sonraki parça
          sırayla çalar; listenin sonunda başa döner.
        </p>
      </div>
      {tracks.map((track, index) => (
        <fieldset
          key={track.id}
          className="space-y-4 rounded-xl border border-line p-4 sm:p-5"
        >
          <legend className="px-2 text-sm font-extrabold text-navy">
            {index + 1}. parça
          </legend>
          <div className="flex justify-end gap-1">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-page disabled:opacity-25"
              disabled={index === 0 || busy}
              onClick={() => move(index, -1)}
              aria-label={index + 1 + ". parçayı yukarı taşı"}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-page disabled:opacity-25"
              disabled={index === tracks.length - 1 || busy}
              onClick={() => move(index, 1)}
              aria-label={index + 1 + ". parçayı aşağı taşı"}
            >
              <ArrowDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full text-red-700 hover:bg-red-50 disabled:opacity-25"
              disabled={tracks.length === 1 || busy}
              onClick={() =>
                setTracks((previous) =>
                  previous.filter((t) => t.id !== track.id),
                )
              }
              aria-label={index + 1 + ". parçayı sil"}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <label className="field-label">
            Parça adı
            <input
              className="input mt-2"
              value={track.title}
              onChange={(e) => update(track.id, { title: e.target.value })}
              maxLength={100}
              required
            />
          </label>
          <label className="field-label">
            YouTube bağlantısı
            <input
              type="url"
              className="input mt-2"
              value={track.url}
              onChange={(e) => update(track.id, { url: e.target.value })}
              maxLength={2048}
              placeholder="https://www.youtube.com/watch?v=…"
              required
            />
          </label>
          <label className="field-label">
            Başlangıç saniyesi
            <input
              type="number"
              className="input mt-2 max-w-[180px]"
              value={track.startSeconds}
              onChange={(e) =>
                update(track.id, { startSeconds: Number(e.target.value) })
              }
              min={0}
              max={86400}
              step={1}
              required
            />
            <span className="mt-1 block text-xs font-normal text-muted">
              Baştan çalmak için 0 yaz.
            </span>
          </label>
        </fieldset>
      ))}
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy || tracks.length >= 30}
          onClick={() =>
            setTracks((previous) => [
              ...previous,
              { id: crypto.randomUUID(), title: "", url: "", startSeconds: 0 },
            ])
          }
        >
          <Plus className="h-4 w-4" /> Parça ekle
        </button>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Kaydediliyor…" : "Çalma listesini kaydet"}
        </button>
      </div>
    </form>
  );
}
