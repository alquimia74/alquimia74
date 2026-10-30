import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertCircle, MessageSquareReply, PenLine } from "lucide-react";
import { getAllEntities, getEntityBySlug } from "@/data/mock-entities";
import { getExperiencesByEntity } from "@/data/mock-experiences";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { EntityLogo } from "@/components/common/Avatar";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { generateMeta } from "@/lib/seo";
import { sortByNewest } from "@/lib/stats";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllEntities().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const entity = getEntityBySlug(slug);
  if (!entity) return {};
  return generateMeta({
    title: entity.seoTitle,
    description: entity.seoDescription,
    path: `/kurumlar/${entity.slug}`,
    noindex: !entity.hasContent,
  });
}

export default async function KurumDetayPage({ params }: PageProps) {
  const { slug } = await params;
  const entity = getEntityBySlug(slug);
  if (!entity) notFound();

  const experiences = sortByNewest(getExperiencesByEntity(slug));
  const cities = new Set(experiences.map((e) => e.city).filter(Boolean)).size;

  return (
    <>
      {/* Kurum profili başlığı */}
      <div className="border-b border-line bg-white">
        <div className="h-24 bg-gradient-to-r from-navy via-navy-light to-brand-dark md:h-36" />
        <div className="container-main">
          <div className="-mt-10 flex flex-col gap-4 pb-6 md:-mt-12 md:flex-row md:items-end">
            <EntityLogo name={entity.name} size={88} className="rounded-2xl border-4 border-white shadow-md" />
            <div className="min-w-0 flex-1 md:pb-1">
              <Breadcrumb items={[{ href: "/kurumlar", label: "Kurumlar" }, { label: entity.name }]} />
              <h1 className="mt-1 text-2xl font-black text-navy md:text-3xl">{entity.name}</h1>
              {entity.alternativeNames.length > 0 && (
                <p className="text-sm text-subtle">Diğer adlar: {entity.alternativeNames.join(" · ")}</p>
              )}
            </div>
            <div className="flex gap-2 md:pb-1 [&>a]:flex-1 md:[&>a]:flex-none">
              <Link href="/deneyimini-paylas" className="btn btn-primary">
                <PenLine className="h-4 w-4" /> Deneyim Yaz
              </Link>
              <Link href="/iletisim" className="btn btn-secondary">
                <MessageSquareReply className="h-4 w-4" /> Cevap Ver
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-2 divide-x divide-line border-t border-line">
            {[
              { value: experiences.length, label: "Deneyim" },
              { value: cities, label: "Şehir" },
            ].map((s) => (
              <div key={s.label} className="py-4 text-center">
                <dd className="text-xl font-black text-navy">{s.value}</dd>
                <dt className="text-xs text-subtle">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="container-main mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-labelledby="experiences-heading">
          <h2 id="experiences-heading" className="section-title mb-4">
            {entity.name} Deneyimleri
          </h2>

          {experiences.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="font-bold text-navy">Henüz yayımlanmış deneyim yok</p>
              <p className="mt-1 text-sm text-muted">Bu kurumla ilgili ilk deneyimi sen paylaşabilirsin.</p>
              <Link href="/deneyimini-paylas" className="btn btn-primary mt-5">
                <PenLine className="h-4 w-4" /> Deneyim Yaz
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="card p-5">
            <h2 className="text-base font-extrabold text-navy">Hakkında</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{entity.neutralDescription}</p>
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-accent/50 bg-accent-soft p-3 text-xs leading-5 text-[#7a5200]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              Bilgiler kamuya açık kaynaklara dayanır. Hukuki ilişkiler resmî ticaret sicili kayıtlarıyla doğrulanmalıdır.
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-base font-extrabold text-navy">Bu kurumu temsil mi ediyorsunuz?</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Yayımlanan içeriklere cevap, düzeltme veya kaldırma talebi iletebilirsiniz.
            </p>
            <Link href="/iletisim" className="btn btn-navy mt-4 w-full">Cevap Hakkı Talebi</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
