"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List, PenLine, Search, X } from "lucide-react";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import type { Experience } from "@/types/experience";
import { cn } from "@/lib/utils";

export default function DeneyimlerClient({
  experiences,
}: {
  experiences: Experience[];
}) {
  const sp = useSearchParams();
  const router = useRouter();

  const [q, setQ] = useState(sp.get("q") || "");
  const [view, setView] = useState<"grid" | "list">("list");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const push = (newQ: string) => {
    const p = new URLSearchParams();
    if (newQ) p.set("q", newQ);
    router.replace(`/deneyimler${p.size ? "?" + p : ""}`, { scroll: false });
  };

  const query = q.toLocaleLowerCase("tr-TR").trim();
  let list = query
    ? experiences.filter((e) =>
        [e.title, e.content, e.city, e.period]
          .filter(Boolean)
          .some((value) => value!.toLocaleLowerCase("tr-TR").includes(query)),
      )
    : experiences;
  list = [...list].sort((a, b) =>
    sort === "newest"
      ? b.publishedAt.localeCompare(a.publishedAt)
      : a.publishedAt.localeCompare(b.publishedAt),
  );
  const reset = () => {
    setQ("");
    router.replace("/deneyimler");
  };

  return (
    <>
      {/* Sayfa başlığı */}
      <div className="border-b border-line bg-white">
        <div className="container-main py-6">
          <h1 className="text-2xl font-black text-navy">Şikâyetler</h1>
          <p className="mt-1 text-sm text-muted">
            Yetiş+ Çarşı hakkında bir araya getirilen çalışan şikâyetleri ve
            anlatımları.
          </p>
        </div>
      </div>

      <div className="container-main mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="card hidden p-5 lg:block">
            <p className="font-extrabold text-navy">Sen de yaşadın mı?</p>
            <p className="mt-1 text-sm text-muted">
              Yaşadıklarını belgeleriyle birlikte bir araya getir.
            </p>
            <Link
              href="/deneyimini-paylas"
              className="btn btn-primary mt-4 w-full"
            >
              <PenLine className="h-4 w-4" /> Şikâyet yaz
            </Link>
          </div>
        </aside>

        <section>
          {/* Araç çubuğu */}
          <div className="card mb-4 flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <input
                type="search"
                id="deneyim-arama"
                placeholder="Şikâyet konusu veya şehir…"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  push(e.target.value);
                }}
                className="input pl-9 pr-9"
                aria-label="Şikâyet ara"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    push("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-ink"
                  aria-label="Aramayı temizle"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
                className="input w-auto cursor-pointer pr-8"
                aria-label="Sıralama"
              >
                <option value="newest">En yeni</option>
                <option value="oldest">En eski</option>
              </select>
              <div className="flex rounded-lg border border-line p-1">
                {(["list", "grid"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    aria-label={
                      v === "grid" ? "Izgara görünümü" : "Liste görünümü"
                    }
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-md transition-colors",
                      view === v
                        ? "bg-brand text-white"
                        : "text-subtle hover:text-ink",
                    )}
                  >
                    {v === "grid" ? (
                      <LayoutGrid className="h-4 w-4" />
                    ) : (
                      <List className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between text-sm">
            <p className="text-muted">
              <span className="font-extrabold text-navy">{list.length}</span>{" "}
              şikâyet listeleniyor
            </p>
            {q && (
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1 text-xs font-bold text-brand"
              >
                <X className="h-3 w-3" /> Filtreleri sıfırla
              </button>
            )}
          </div>

          {list.length === 0 ? (
            <div className="card py-20 text-center">
              <Search className="mx-auto mb-4 h-10 w-10 text-line" />
              <p className="font-bold text-navy">Sonuç bulunamadı</p>
              <p className="mb-5 mt-1 text-sm text-muted">
                Farklı bir kelime deneyebilirsin.
              </p>
              <button type="button" onClick={reset} className="btn btn-primary">
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid gap-4 md:grid-cols-2"
                  : "flex flex-col gap-4"
              }
            >
              {list.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
