import type { AdminNote } from "@/types/moderation";
import { safeExternalLink } from "@/lib/music";
export function AdminNotes({ notes = [] }: { notes?: AdminNote[] }) {
  const visible = notes.filter((n) => n.public);
  if (!visible.length) return null;
  return (
    <section
      className="user-content mt-6 rounded-xl border border-brand-line bg-brand-soft/40 p-5"
      aria-label="Yayıncı notu"
    >
      <h2 className="text-sm font-extrabold text-navy">Yayıncı notu</h2>
      <div className="mt-3 space-y-4">
        {visible.map((n) => (
          <div key={n.id}>
            {n.text && (
              <p className="whitespace-pre-wrap text-sm leading-7">{n.text}</p>
            )}
            {n.url && safeExternalLink(n.url) && (
              <a
                href={safeExternalLink(n.url)!}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="mt-2 inline-block text-sm font-bold text-brand underline"
              >
                {n.text ? "Belgeyi aç ↗" : "Ek belgeyi aç ↗"}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
