import { notFound } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, Briefcase, Building2, Calendar, Info, MapPin, PenLine } from "lucide-react";
import { getExperienceBySlug, getAllExperiences, getExperiencesByEntity } from "@/data/mock-experiences";
import { getEntityBySlug } from "@/data/mock-entities";
import { generateMeta } from "@/lib/seo";
import { formatDate, formatPeriod } from "@/lib/utils";
import { sortByNewest } from "@/lib/stats";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Avatar, EntityLogo } from "@/components/common/Avatar";
import { ExperienceRow } from "@/components/experiences/ExperienceCard";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllExperiences().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) return {};
  return generateMeta({ title: `${exp.title} | YetişVar`, description: exp.summary, path: `/deneyimler/${exp.slug}` });
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) notFound();

  const entity = getEntityBySlug(exp.entitySlug);
  const entityCount = getExperiencesByEntity(exp.entitySlug).length;
  const author = exp.role ?? "Anonim Çalışan";
  const similar = sortByNewest(getAllExperiences().filter((e) => e.id !== exp.id && e.entitySlug === exp.entitySlug)).slice(0, 4);

  const meta = [
    { icon: Building2, label: "Kurum", value: exp.relatedEntity },
    { icon: Calendar,  label: "Çalışma dönemi", value: formatPeriod(exp.employmentStart, exp.employmentEnd) },
    exp.city && { icon: MapPin, label: "Şehir", value: exp.city },
    exp.role && { icon: Briefcase, label: "Görev", value: exp.role },
  ].filter(Boolean) as { icon: typeof Building2; label: string; value: string }[];

  return (
    <div className="container-main mt-5">
      <Breadcrumb
        items={[
          { href: "/deneyimler", label: "Deneyimler" },
          { href: `/kurumlar/${exp.entitySlug}`, label: exp.relatedEntity },
          { label: exp.title },
        ]}
      />

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <article className="card">
            <header className="flex items-center gap-3 border-b border-line px-6 py-4">
              <Avatar name={author} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{author}</p>
                <p className="text-xs text-subtle">
                  Anonim · <time dateTime={exp.publishedAt}>{formatDate(exp.publishedAt)}</time>
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand">
                <BadgeCheck className="h-4 w-4" /> Editör onaylı
              </span>
            </header>

            <div className="px-6 py-6 md:px-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Link
                  href={`/kurumlar/${exp.entitySlug}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-xs font-bold text-navy hover:border-brand hover:text-brand"
                >
                  <EntityLogo name={exp.relatedEntity} size={18} className="rounded" />
                  {exp.relatedEntity}
                </Link>
              </div>

              <h1 className="text-2xl font-black leading-tight text-navy md:text-3xl">{exp.title}</h1>

              <p className="mt-6 whitespace-pre-line text-[15px] leading-[1.85] text-ink">{exp.content}</p>

              <dl className="mt-8 grid gap-3 rounded-xl bg-page p-4 sm:grid-cols-2">
                {meta.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-brand">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-subtle">{label}</dt>
                      <dd className="text-sm font-bold text-ink">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <footer className="flex items-start gap-2 border-t border-line px-6 py-4 text-xs leading-5 text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-subtle" />
              Bu içerik başvuru sahibinin kendi beyanıdır ve editöryal incelemeden geçerek yayımlanmıştır.
              İlgili kurum, <Link href="/iletisim" className="font-bold text-brand">cevap hakkını</Link> kullanabilir.
            </footer>
          </article>

          <div className="card flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <h2 className="font-extrabold text-navy">Benzer bir deneyim yaşadın mı?</h2>
              <p className="mt-1 text-sm text-muted">Yaşadıklarını anonim olarak paylaşabilirsin.</p>
            </div>
            <Link href="/deneyimini-paylas" className="btn btn-primary">
              <PenLine className="h-4 w-4" /> Deneyim Yaz
            </Link>
          </div>
        </div>

        <aside className="space-y-6">
          {/* Kurum kartı */}
          <div className="card overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-navy to-navy-light" />
            <div className="-mt-8 px-5 pb-5">
              <EntityLogo name={exp.relatedEntity} size={64} className="border-4 border-white shadow-sm" />
              <h2 className="mt-3 text-lg font-extrabold text-navy">{exp.relatedEntity}</h2>
              {entity && entity.alternativeNames.length > 0 && (
                <p className="text-xs text-subtle">{entity.alternativeNames.join(" · ")}</p>
              )}
              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-page p-3">
                  <p className="text-xl font-black text-navy">{entityCount}</p>
                  <p className="text-[11px] text-subtle">Deneyim</p>
                </div>
                <div className="rounded-lg bg-brand-soft p-3">
                  <p className="text-xl font-black text-brand">%100</p>
                  <p className="text-[11px] text-subtle">Editör kontrollü</p>
                </div>
              </div>
              <Link href={`/kurumlar/${exp.entitySlug}`} className="btn btn-outline mt-4 w-full">
                Kurum sayfasına git
              </Link>
            </div>
          </div>

          {similar.length > 0 && (
            <div className="card px-5 py-4">
              <h2 className="text-base font-extrabold text-navy">Benzer Deneyimler</h2>
              <div className="mt-1 divide-y divide-line">
                {similar.map((e) => <ExperienceRow key={e.id} experience={e} />)}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
