"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PenLine, Search, ShieldCheck, X } from "lucide-react";
import { Logo } from "./Logo";
import { SearchBox } from "@/components/common/SearchBox";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/deneyimler", label: "Şikâyetler" },
  { href: "/kurumlar", label: "Kurumlar" },
  { href: "/yayin-ilkeleri", label: "Yayın İlkeleri" },
  { href: "/hakkimizda", label: "Hakkımızda" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Üst bilgi şeridi */}
      <div className="hidden bg-navy text-white sm:block">
        <div className="container-main flex h-9 items-center justify-between gap-4 text-xs">
          <p className="flex items-center gap-2 truncate">
            <span className="font-semibold text-white/90">
              Yetiş+ Çarşı çalışan şikâyetleri
            </span>
            <span className="hidden items-center gap-1 text-white/70 md:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-light" />
              Çalışanların bağımsız şikâyet arşivi
            </span>
          </p>
          <div className="flex shrink-0 items-center gap-4 text-white/80">
            <Link
              href="/yayin-ilkeleri"
              className="hidden hover:text-white sm:inline"
            >
              Yayın İlkeleri
            </Link>
            <Link href="/iletisim" className="hover:text-white">
              Cevap Hakkı
            </Link>
          </div>
        </div>
      </div>

      {/* Ana satır */}
      <div className="border-b border-line">
        <div className="container-main flex h-16 items-center gap-4 md:h-[72px] md:gap-8">
          <Link
            href="/"
            aria-label="yetişikayet.com Ana Sayfa"
            className="shrink-0"
          >
            <Logo height={38} />
          </Link>

          <SearchBox className="hidden max-w-xl flex-1 md:flex" />

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full md:hidden",
                searchOpen
                  ? "bg-brand-soft text-brand"
                  : "text-muted hover:bg-page",
              )}
              aria-label={searchOpen ? "Aramayı kapat" : "Ara"}
              aria-expanded={searchOpen}
            >
              {searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
            {/* Mobilde "Yaz" butonu alttaki sekme çubuğunda */}
            <Link
              href="/deneyimini-paylas"
              className="btn btn-primary hidden sm:inline-flex"
            >
              <PenLine className="h-4 w-4" />
              Şikâyet yaz
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full text-muted hover:bg-page lg:hidden"
              aria-label="Menü"
              aria-expanded={menuOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="container-main pb-3 md:hidden">
            <SearchBox autoFocus />
          </div>
        )}
      </div>

      {/* Navigasyon sekmeleri */}
      <nav
        className="hidden border-b border-line bg-white lg:block"
        aria-label="Ana menü"
      >
        <div className="container-main flex h-12 items-stretch gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "relative flex items-center px-3 text-sm font-semibold transition-colors",
                isActive(href) ? "text-brand" : "text-muted hover:text-navy",
              )}
            >
              {label}
              {isActive(href) && (
                <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t bg-brand" />
              )}
            </Link>
          ))}
          <Link
            href="/iletisim"
            className="ml-auto flex items-center gap-2 rounded-full bg-brand px-4 my-2 text-xs font-extrabold text-white hover:bg-brand-dark"
          >
            <ShieldCheck className="h-4 w-4 text-brand" />
            İnkâr ediyorsanız, somut belge sunun.
          </Link>
        </div>
      </nav>

      {/* Mobil menü */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-navy/50 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="fixed inset-y-0 right-0 z-50 flex w-80 max-w-[88vw] flex-col bg-white shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menü"
          >
            <div className="flex h-[72px] items-center justify-between border-b border-line px-5">
              <Logo height={32} />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-page"
                aria-label="Menüyü kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center border-l-[3px] px-5 py-3.5 text-[15px] font-semibold",
                    isActive(href)
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-transparent text-ink hover:bg-page",
                  )}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/iletisim"
                onClick={() => setMenuOpen(false)}
                className="flex items-center border-l-[3px] border-transparent px-5 py-3.5 text-[15px] font-semibold text-ink hover:bg-page"
              >
                İletişim
              </Link>
            </nav>
            <div className="border-t border-line p-5">
              <Link
                href="/deneyimini-paylas"
                onClick={() => setMenuOpen(false)}
                className="btn btn-primary w-full"
              >
                <PenLine className="h-4 w-4" /> Şikâyet yaz
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
