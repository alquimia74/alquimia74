import { EmployerResponseCta } from "./EmployerResponseCta";
import Link from "next/link";
import { STAFF_LABELS } from "@/types/submission";
import { BadgeCheck } from "lucide-react";
import { type Experience } from "@/types/experience";
import { Avatar, EntityLogo } from "@/components/common/Avatar";
import { cn, formatDate } from "@/lib/utils";

/** Sikayet kartı düzeninde deneyim kartı */
export function ExperienceCard({
  experience: exp,
  className,
}: {
  experience: Experience;
  className?: string;
}) {
  const author = exp.isExample ? "Örnek kayıt" : "Çalışan anlatımı";

  return (
    <article
      className={cn(
        "card card-hover user-content flex flex-col p-4 sm:p-5",
        className,
      )}
    >
      <header className="flex items-center gap-3">
        <Avatar name={author} size={38} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">{author}</p>
          <p className="text-xs text-subtle">
            Anonim ·{" "}
            <time dateTime={exp.publishedAt}>
              {formatDate(exp.publishedAt)}
            </time>
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-1 text-[11px] font-bold text-brand"
          title={
            exp.isExample
              ? "Bu anlatım sayfa düzenini göstermek için hazırlanmıştır."
              : "İçeriğin yayın durumu"
          }
        >
          <BadgeCheck className="h-3.5 w-3.5" />{" "}
          {exp.isExample
            ? "Örnek içerik"
            : exp.evidenceStatus === "reviewed"
              ? "Belgesi incelendi"
              : "Çalışan anlatımı"}
        </span>
      </header>

      <h2 className="mt-4 text-[17px] font-extrabold leading-snug text-navy">
        <Link href={`/deneyimler/${exp.slug}`} className="hover:text-brand">
          {exp.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">
        {exp.content}
      </p>
      <p className="mt-3 text-xs text-muted">
        {[
          exp.city,
          exp.staffType ? STAFF_LABELS[exp.staffType] : null,
          exp.period,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>
      <Link
        href={`/deneyimler/${exp.slug}`}
        className="mt-1 text-sm font-bold text-brand hover:text-brand-dark"
      >
        Devamını oku
      </Link>

      <div className="mt-auto pt-4">
        <footer className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <Link
            href={`/kurumlar/${exp.entitySlug}`}
            className="flex min-w-0 items-center gap-2 text-sm font-bold text-ink hover:text-brand"
          >
            <EntityLogo
              name={exp.relatedEntity}
              size={26}
              className="rounded-md"
            />
            <span className="truncate">{exp.relatedEntity}</span>
          </Link>
        </footer>
        <EmployerResponseCta slug={exp.slug} compact />
      </div>
    </article>
  );
}

/** Yan sütunlar için kompakt satır */
export function ExperienceRow({ experience: exp }: { experience: Experience }) {
  return (
    <Link href={`/deneyimler/${exp.slug}`} className="group flex gap-3 py-3">
      <EntityLogo name={exp.relatedEntity} size={36} className="rounded-lg" />
      <div className="min-w-0">
        <p className="line-clamp-2 text-sm font-bold leading-5 text-ink group-hover:text-brand">
          {exp.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-subtle">
          {exp.relatedEntity} · {formatDate(exp.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
