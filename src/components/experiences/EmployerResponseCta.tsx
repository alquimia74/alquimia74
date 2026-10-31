import Link from "next/link";
import { ArrowRight } from "lucide-react";
export function EmployerResponseCta({
  slug,
  compact = false,
}: {
  slug: string;
  compact?: boolean;
}) {
  return (
    <section
      aria-label="İşveren yanıtı"
      className={
        compact
          ? "mt-4 border-t border-line pt-3"
          : "card flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
      }
    >
      {!compact && (
        <div>
          <h2 className="font-extrabold text-navy">İşveren açıklaması</h2>
          <p className="mt-1 text-sm text-muted">
            Yanıtınızı yazın. Yayın kararını yayıncı verir.
          </p>
        </div>
      )}
      <Link
        href={"/isveren-yaniti/" + encodeURIComponent(slug)}
        className={
          compact
            ? "inline-flex items-center gap-1 text-xs font-bold text-navy hover:text-brand"
            : "btn btn-secondary"
        }
      >
        İşveren: Yanıt ver <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}
