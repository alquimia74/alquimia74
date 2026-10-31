import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { getAllEntities } from "@/data/mock-entities";
import { EntityLogo } from "@/components/common/Avatar";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateMeta } from "@/lib/seo";
import { config } from "@/lib/config";
export const metadata = generateMeta({
  title: "Hızır Global A.Ş. ve Markaları | Yetiş+ Çarşı Kurum Rehberi",
  description:
    "Hızır Global A.Ş. bünyesindeki Yetiş+ Çarşı, Yetiş+ Yemek, YETON ve diğer marka adları. Resmî web siteleri, marka bilgileri ve operasyonel faaliyetlere ilişkin açıklamalar.",
  path: "/kurumlar",
});
export default function Page() {
  const entities = getAllEntities();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Hızır Global A.Ş. ve Markaları",
          url: config.siteUrl + "/kurumlar",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: entities.map((e, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: e.name,
              url: config.siteUrl + "/kurumlar/" + e.slug,
            })),
          },
        }}
      />
      <div className="border-b border-line bg-white">
        <div className="container-main py-7">
          <Breadcrumb items={[{ label: "Kurumlar ve Markalar" }]} />
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brand">
            Yetiş+ Çarşı’nın kurumsal bağlamı
          </p>
          <h1 className="mt-2 text-2xl font-black text-navy md:text-3xl">
            Hızır Global A.Ş. ve Markaları
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            Yetiş+ Çarşı, Hızır Global A.Ş.’nin resmî marka sayfasında
            ekosistemin pazaryeri platformu olarak tanıtılır. Bu rehber, Hızır
            Global A.Ş. adıyla tanıtılan kurum ve markaları bir araya getirir.
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Markaların faaliyet durumu aynı değildir. Bazıları resmî sitede “Çok
            yakında” olarak tanıtılırken, bazıları için operasyonun kapsamı ve
            sürekliliği hakkında bu rehberin kaynaklarında somut bilgi
            bulunmuyor. Bir marka adının listede yer alması, aktif operasyon
            yürütüldüğü anlamına gelmez.
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Şikâyet arşivimizin odağı Yetiş+ Çarşı’dır. Diğer marka kayıtları
            kurumsal bilgi içindir.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/deneyimler" className="btn btn-primary">
              Yetiş+ Çarşı şikâyetleri
            </Link>
            <a
              className="btn btn-secondary"
              href="https://hizirglobal.com.tr/tr/brands"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resmî marka listesi <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="container-main mt-7 space-y-9">
        <section aria-labelledby="brand-directory-title">
          <h2 id="brand-directory-title" className="section-title mb-4">
            Kurumlar ve Markalar
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entities.map((e) => (
              <article key={e.id} className="card flex flex-col p-5">
                <div className="flex items-center gap-3">
                  <EntityLogo name={e.name} size={44} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-subtle">
                      {e.category}
                    </p>
                    <h3 className="font-extrabold text-navy">
                      <Link
                        className="hover:text-brand"
                        href={"/kurumlar/" + e.slug}
                      >
                        {e.name}
                      </Link>
                    </h3>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-6 text-muted">
                  {e.neutralDescription}
                </p>
                {e.comingSoon && (
                  <p className="mt-3 text-xs text-subtle">
                    Resmî sitedeki durum: Çok yakında
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <Link
                    href={"/kurumlar/" + e.slug}
                    className="inline-flex items-center text-sm font-bold text-brand"
                  >
                    Bilgileri gör <ChevronRight className="h-4 w-4" />
                  </Link>
                  {e.website && (
                    <a
                      href={e.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-muted"
                    >
                      Resmî site <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
        <p className="text-xs leading-6 text-subtle">
          Kaynaklar 31 Ekim 2026 tarihinde gözden geçirildi. Mevcut resmî web
          sitesi bağlantıları ilgili marka kartlarında yer alır.
        </p>
      </div>
    </>
  );
}
