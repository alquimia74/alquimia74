import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Breadcrumb } from "./Breadcrumb";
import { cn } from "@/lib/utils";

const PAGES = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/nasil-calisir", label: "Nasıl Çalışır?" },
  { href: "/yayin-ilkeleri", label: "Yayın İlkeleri" },
  { href: "/sikca-sorulan-sorular", label: "Sık Sorulan Sorular" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/gizlilik", label: "Gizlilik Politikası" },
  { href: "/kvkk-aydinlatma", label: "Kişisel Veriler" },
];

interface InfoLayoutProps {
  path: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}

/** Kurumsal / yasal sayfalar için ortak düzen: başlık bandı + sol menü + içerik */
export function InfoLayout({ path, title, lead, children }: InfoLayoutProps) {
  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="container-main py-6">
          <Breadcrumb items={[{ label: title }]} />
          <h1 className="mt-3 text-2xl font-black text-navy md:text-3xl">
            {title}
          </h1>
          {lead && (
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
              {lead}
            </p>
          )}
        </div>
      </div>

      <div className="container-main mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <nav
            className="card sticky top-[180px] py-2"
            aria-label="Kurumsal sayfalar"
          >
            {PAGES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                aria-current={p.href === path ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between border-l-[3px] px-5 py-2.5 text-sm font-semibold transition-colors",
                  p.href === path
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-transparent text-muted hover:bg-page hover:text-ink",
                )}
              >
                {p.label}
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </>
  );
}
