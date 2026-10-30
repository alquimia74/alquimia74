import Link from "next/link";
import { ChevronRight, Info } from "lucide-react";
import { generateMeta } from "@/lib/seo";
import { getEntityRanking } from "@/lib/stats";
import { EntityLogo } from "@/components/common/Avatar";
import { Breadcrumb } from "@/components/common/Breadcrumb";

export const metadata = generateMeta({
  title: "Kurumlar ve Markalar Dizini",
  description:
    "Yetiş+ Çarşı, Hızır Global A.Ş. ve ilgili markalar hakkında çalışan deneyimlerinin paylaşıldığı bağımsız platform.",
  path: "/kurumlar",
});

export default function KurumlarPage() {
  const ranking = getEntityRanking();

  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="container-main py-6">
          <Breadcrumb items={[{ label: "Kurumlar" }]} />
          <h1 className="mt-3 text-2xl font-black text-navy">Kurumlar ve Markalar</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Platformdaki deneyimlerde anılan kurum ve markalar. Aralarındaki hukuki ilişkiler
            resmî kaynaklarla doğrulanmalıdır.
          </p>
        </div>
      </div>

      <div className="container-main mt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ranking.map(({ entity, count }) => (
            <Link
              key={entity.id}
              href={`/kurumlar/${entity.slug}`}
              className="card card-hover group flex flex-col p-5"
            >
              <div className="flex items-center gap-4">
                <EntityLogo name={entity.name} size={56} />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-extrabold text-navy group-hover:text-brand">{entity.name}</h2>
                  {entity.alternativeNames.length > 0 && (
                    <p className="truncate text-xs text-subtle">{entity.alternativeNames.join(" · ")}</p>
                  )}
                </div>
              </div>
              <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted">{entity.neutralDescription}</p>
              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between border-t border-line pt-4">
                  <span className="text-sm">
                    <span className="font-black text-navy">{count}</span>{" "}
                    <span className="text-subtle">deneyim</span>
                  </span>
                  <span className="inline-flex items-center text-sm font-bold text-brand">
                    Profili gör <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-subtle">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Kurum logoları yerine baş harf gösterilmektedir. YetişVar, listelenen kurumların resmî temsilcisi değildir.
        </p>
      </div>
    </>
  );
}
