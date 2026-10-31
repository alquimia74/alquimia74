import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, PenLine } from "lucide-react";
import { getAllEntities, getEntityBySlug } from "@/data/mock-entities";
import { getExperiencesByEntity } from "@/lib/server/experiences";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { EntityLogo } from "@/components/common/Avatar";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateMeta } from "@/lib/seo";
import { config } from "@/lib/config";
interface Props {
  params: Promise<{ slug: string }>;
}
export async function generateStaticParams() {
  return getAllEntities().map((e) => ({ slug: e.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const e = getEntityBySlug(slug);
  return e
    ? generateMeta({
        title: e.seoTitle,
        description: e.seoDescription,
        path: "/kurumlar/" + slug,
      })
    : {};
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const e = getEntityBySlug(slug);
  if (!e) notFound();
  const main = slug === "yetis-carsi";
  const complaints = main ? await getExperiencesByEntity("yetis-carsi") : [];
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: e.seoTitle,
          description: e.seoDescription,
          url: config.siteUrl + "/kurumlar/" + slug,
          ...(e.sourceUrl ? { citation: e.sourceUrl } : {}),
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Ana Sayfa",
                item: config.siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Kurumlar ve Markalar",
                item: config.siteUrl + "/kurumlar",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: e.name,
                item: config.siteUrl + "/kurumlar/" + slug,
              },
            ],
          },
        }}
      />
      <div className="border-b border-line bg-white">
        <div className="h-20 bg-gradient-to-r from-navy to-brand-dark" />
        <div className="container-main pb-6">
          <div className="-mt-7 flex items-end gap-4">
            <EntityLogo
              name={e.name}
              size={72}
              className="border-4 border-white shadow-sm"
            />
            <div className="pb-1">
              <p className="text-xs font-semibold text-subtle">{e.category}</p>
              <h1 className="text-2xl font-black text-navy md:text-3xl">
                {main ? "Yetiş+ Çarşı Çalışan Şikâyetleri" : e.name}
              </h1>
            </div>
          </div>
          <div className="mt-4">
            <Breadcrumb
              items={[
                { href: "/kurumlar", label: "Kurumlar ve Markalar" },
                { label: e.name },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="container-main mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <article className="card prose-yv p-6 md:p-8">
            <h2 className="!mt-0">{e.name} hakkında</h2>
            <p>{e.neutralDescription}</p>
            {e.sourceKind === "official" ? (
              <p>
                {main
                  ? "Hızır Global A.Ş.’nin resmî marka sayfasında ekosistemin pazaryeri platformu olarak yer alır. Bu sayfa, Yetiş+ Çarşı çalışanlarının ücret, sigorta ve çalışma koşullarına ilişkin anlatımlarını bir araya getirir."
                  : slug === "hazir-global"
                    ? "Bu kurum kaydı, Yetiş+ Çarşı’nın resmî kaynaklarda nasıl konumlandırıldığını açıklayan üst çatı bilgisini sunar. Çalışan şikâyetleri ayrı şirket başlıklarına bölünmeden Yetiş+ Çarşı arşivinde toplanır."
                    : "Hızır Global A.Ş.’nin resmî marka listesinde yer alır. Bu kayıt, Yetiş+ Çarşı’nın içinde bulunduğu ekosistemi tanımak isteyen okuyucular için hazırlanmıştır."}
              </p>
            ) : (
              <p>
                Bu marka, Hızır Global A.Ş. çatısı altında tanıtılan isimler
                arasında yer alır. İncelediğimiz kaynaklarda bu marka için
                fiilen yürütülen operasyonun kapsamını ve sürekliliğini gösteren
                somut bilgi bulunmuyor. Bu nedenle marka tanıtımı ile
                operasyonel faaliyet bilgisi ayrı ele alınır.
              </p>
            )}
            {e.comingSoon && (
              <p>
                İnceleme tarihinde Hızır Global A.Ş.’nin resmî sayfasında “Çok
                yakında” olarak gösterilmektedir.
              </p>
            )}
            {e.alternativeNames.length > 0 && (
              <p>
                <strong>Diğer yazımlar:</strong> {e.alternativeNames.join(", ")}
              </p>
            )}
            <h2>
              {main
                ? "Yayın yaklaşımı"
                : "Bu kaydın şikâyet arşiviyle ilişkisi"}
            </h2>
            <p>
              {main
                ? "Yayın öncesinde başvuru sahibi dinlenir ve destekleyici belgeler incelenir. Paylaşılmasına izin verilen belgeler kişisel bilgiler gizlenerek ilgili kayda eklenir."
                : "Bu sayfa bir marka bilgi kaydıdır; bu marka hakkında şikâyet bulunduğu anlamına gelmez. Şikâyet başvuruları yalnızca Yetiş+ Çarşı çalışma deneyimleri için hazırlanır."}
            </p>
            <h2>Kaynak</h2>
            {e.sourceUrl ? (
              <p>
                <a
                  className="font-bold text-brand"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={e.sourceUrl}
                >
                  Hızır Global A.Ş.’nin resmî{" "}
                  {slug === "hazir-global"
                    ? "kurumsal sayfası"
                    : "marka listesi"}
                </a>
              </p>
            ) : (
              <p>Hızır Global A.Ş.’nin marka tanıtım görseli.</p>
            )}
            <p className="text-xs text-subtle">
              Kaynak kontrolü: 31 Ekim 2026.
            </p>
          </article>
          {main && (
            <section>
              <h2 className="section-title mb-4">
                Yetiş+ Çarşı şikâyetleri ve anlatımları
              </h2>
              <div className="space-y-4">
                {complaints.map((c) => (
                  <ExperienceCard key={c.id} experience={c} />
                ))}
              </div>
            </section>
          )}
        </div>
        <aside className="space-y-5">
          <div className="card p-5">
            <h2 className="font-extrabold text-navy">
              Yetiş+ Çarşı şikâyet arşivi
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Çalışan anlatımları, belgeler ve yaşanan gelişmeler tek arşivde.
            </p>
            <Link className="btn btn-primary mt-4 w-full" href="/deneyimler">
              Şikâyetleri oku
            </Link>
            {main && (
              <Link
                className="btn btn-secondary mt-3 w-full"
                href="/deneyimini-paylas"
              >
                <PenLine className="h-4 w-4" /> Şikâyetini hazırla
              </Link>
            )}
          </div>
          {e.website && (
            <div className="card p-5">
              <h2 className="font-extrabold text-navy">Resmî web sitesi</h2>
              <a
                className="mt-3 inline-flex items-center gap-2 break-all text-sm font-bold text-brand"
                href={e.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {new URL(e.website).hostname}
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>
            </div>
          )}
          <div className="card p-5">
            <h2 className="font-extrabold text-navy">Kurumlar ve markalar</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Hızır Global A.Ş. çatısı altında tanıtılan kurum ve markalar
              hakkında bilgiler.
            </p>
            <Link href="/kurumlar" className="link-more mt-3">
              Rehbere dön
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
