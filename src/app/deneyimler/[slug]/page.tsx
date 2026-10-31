import { AdminNotes } from "@/components/experiences/AdminNotes";
import { STAFF_LABELS } from "@/types/submission";
import { EmployerResponseCta } from "@/components/experiences/EmployerResponseCta";
import { safeDocumentUrl } from "@/lib/security";
import { config } from "@/lib/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  PenLine,
} from "lucide-react";
import {
  getExperienceBySlug,
  getAllExperiences,
} from "@/lib/server/experiences";
import { getEntityBySlug } from "@/data/mock-entities";
import { generateMeta } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { sortByNewest } from "@/lib/stats";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Avatar, EntityLogo } from "@/components/common/Avatar";
import { ExperienceRow } from "@/components/experiences/ExperienceCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const exp = await getExperienceBySlug(slug);
  if (!exp) return {};
  return generateMeta({
    title: `${exp.title} | yetişikayet.com`,
    description: exp.summary,
    noindex: exp.isExample,
    path: `/deneyimler/${exp.slug}`,
  });
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const exp = await getExperienceBySlug(slug);
  if (!exp) notFound();

  const entity = getEntityBySlug(exp.entitySlug);
  const publicDocuments = (exp.documents ?? [])
    .filter((doc) => doc.redacted === true && doc.publicationApproved === true)
    .map((doc) => ({
      ...doc,
      safeUrl: safeDocumentUrl(doc.url, config.siteUrl),
    }))
    .filter(
      (doc): doc is typeof doc & { safeUrl: string } => doc.safeUrl !== null,
    );
  const author = exp.isExample ? "Örnek kayıt" : "Çalışan anlatımı";
  const similar = sortByNewest(
    (await getAllExperiences()).filter(
      (e) => e.id !== exp.id && e.entitySlug === exp.entitySlug,
    ),
  ).slice(0, 4);

  const meta = [
    exp.period && {
      icon: Calendar,
      label: "Çalışma dönemi",
      value: exp.period,
    },
    exp.city && { icon: MapPin, label: "İl", value: exp.city },
    exp.staffType && {
      icon: Briefcase,
      label: "Kadro",
      value: STAFF_LABELS[exp.staffType],
    },
  ].filter(Boolean) as {
    icon: typeof Building2;
    label: string;
    value: string;
  }[];

  return (
    <div className="container-main mt-5">
      <Breadcrumb
        items={[
          { href: "/deneyimler", label: "Şikâyetler" },
          { href: `/kurumlar/${exp.entitySlug}`, label: exp.relatedEntity },
          { label: exp.title },
        ]}
      />

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <article className="card user-content">
            <header className="flex items-center gap-3 border-b border-line px-6 py-4">
              <Avatar name={author} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{author}</p>
                <p className="text-xs text-subtle">
                  Anonim ·{" "}
                  <time dateTime={exp.publishedAt}>
                    {formatDate(exp.publishedAt)}
                  </time>
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand">
                <BadgeCheck className="h-4 w-4" />{" "}
                {exp.isExample
                  ? "Örnek içerik"
                  : exp.evidenceStatus === "reviewed"
                    ? "Belgesi incelendi"
                    : "Çalışan anlatımı"}
              </span>
            </header>

            <div className="px-6 py-6 md:px-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Link
                  href={`/kurumlar/${exp.entitySlug}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-xs font-bold text-navy hover:border-brand hover:text-brand"
                >
                  <EntityLogo
                    name={exp.relatedEntity}
                    size={18}
                    className="rounded"
                  />
                  {exp.relatedEntity}
                </Link>
              </div>

              <h1 className="text-2xl font-black leading-tight text-navy md:text-3xl">
                {exp.title}
              </h1>

              <p className="mt-6 whitespace-pre-line text-[15px] leading-[1.85] text-ink">
                {exp.content}
              </p>

              <AdminNotes notes={exp.adminNotes} />
              {!exp.isExample && publicDocuments.length > 0 && (
                <section
                  className="mt-6 rounded-xl border border-line p-5"
                  aria-label="Paylaşılan belgeler"
                >
                  <h2 className="font-extrabold text-navy">
                    Paylaşılan belgeler
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    Kişisel bilgileri gizlenmiş, paylaşılmasına izin verilen
                    kopyalar.
                  </p>
                  <ul className="mt-3 space-y-2">
                    {publicDocuments.map((doc) => (
                      <li key={doc.url}>
                        <a
                          href={doc.safeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-brand underline"
                        >
                          {doc.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {meta.length > 0 && (
                <dl className="mt-8 grid gap-3 rounded-xl bg-page p-4 sm:grid-cols-2">
                  {meta.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-brand">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-subtle">
                          {label}
                        </dt>
                        <dd className="text-sm font-bold text-ink">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </article>
          {exp.employerResponses?.map((reply) => (
            <section
              key={reply.id}
              className="card user-content p-5 sm:p-7"
              aria-label="İşveren yanıtı"
            >
              <h2 className="font-extrabold text-navy">İşveren yanıtı</h2>
              <p className="mt-2 text-xs text-muted">
                {reply.name} · {reply.role} · {formatDate(reply.publishedAt)}
              </p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7">
                {reply.body}
              </p>
              <AdminNotes notes={reply.adminNotes} />
            </section>
          ))}
          <EmployerResponseCta slug={exp.slug} />

          <div className="card flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <h2 className="font-extrabold text-navy">
                Benzer bir deneyim yaşadın mı?
              </h2>
              <p className="mt-1 text-sm text-muted">
                Yaşadıklarını kişisel bilgileri paylaşmadan, belgeleriyle
                birlikte hazırlayabilirsin.
              </p>
            </div>
            <Link href="/deneyimini-paylas" className="btn btn-primary">
              <PenLine className="h-4 w-4" /> Şikâyet yaz
            </Link>
          </div>
        </div>

        <aside className="space-y-6">
          {/* Kurum kartı */}
          <div className="card overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-navy to-navy-light" />
            <div className="-mt-8 px-5 pb-5">
              <EntityLogo
                name={exp.relatedEntity}
                size={64}
                className="border-4 border-white shadow-sm"
              />
              <h2 className="mt-3 text-lg font-extrabold text-navy">
                {exp.relatedEntity}
              </h2>
              {entity && entity.alternativeNames.length > 0 && (
                <p className="text-xs text-subtle">
                  {entity.alternativeNames.join(" · ")}
                </p>
              )}
              <p className="mt-4 text-sm leading-6 text-muted">
                Şikâyetler, çalışan anlatımları ve paylaşıma uygun belgeler bir
                arada.
              </p>
              <Link
                href={`/kurumlar/${exp.entitySlug}`}
                className="btn btn-outline mt-4 w-full"
              >
                Kurum sayfasına git
              </Link>
            </div>
          </div>

          {similar.length > 0 && (
            <div className="card px-5 py-4">
              <h2 className="text-base font-extrabold text-navy">
                Benzer Şikâyetler
              </h2>
              <div className="mt-1 divide-y divide-line">
                {similar.map((e) => (
                  <ExperienceRow key={e.id} experience={e} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
