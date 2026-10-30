import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ href: "/", label: "Ana Sayfa" }, ...items];
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-subtle">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className="hover:text-brand">{c.label}</Link>
            ) : (
              <span className="font-medium text-muted">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
