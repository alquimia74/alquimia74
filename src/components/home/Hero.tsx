import { Barlow_Condensed } from "next/font/google";
import Link from "next/link";
import { ArrowUpRight, FileText, ShieldCheck, ArrowRight } from "lucide-react";
import { SearchBox } from "@/components/common/SearchBox";
const displayFont = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["800", "900"],
  display: "swap",
});
export function Hero() {
  return (
    <section
      className="hero-surface relative isolate overflow-hidden text-white"
      aria-labelledby="hero-title"
    >
      <div className="hero-grid" aria-hidden />
      <div className="hero-wordmark" aria-hidden>
        KAYIT.
      </div>
      <div className="container-main relative">
        <div className="hero-topline">
          <span className="inline-flex items-center gap-2.5">
            <span className="h-2 w-2 bg-accent" />
            YETİŞ+ ÇARŞI ÇALIŞANLARININ BAĞIMSIZ ARŞİVİ
          </span>
          <span className="hidden text-white/40 sm:inline">
            yetişikayet.com
          </span>
        </div>
        <div className="hero-layout">
          <div className="min-w-0">
            <h1
              id="hero-title"
              className={displayFont.className + " hero-heading"}
            >
              <span className="block">YAŞADIKLARIN</span>
              <span className="hero-heading-accent block text-accent">
                KAYITSIZ KALMASIN.
              </span>
            </h1>
            <p className="hero-description">
              Hızır Global A.Ş. bünyesindeki Yetiş+ Çarşı hakkında çalışan
              şikâyetlerini, belgeleriyle bir araya getiriyoruz.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/deneyimini-paylas" className="hero-cta">
                Şikâyetini yaz <ArrowUpRight className="h-5 w-5" />
              </Link>
              <Link
                href="/nasil-calisir"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white"
              >
                Nasıl çalışır? <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <SearchBox size="lg" className="hero-search mt-8 max-w-xl" />
          </div>
          <div className="hero-archive" aria-hidden>
            <div className="hero-paper hero-paper-back" />
            <div className="hero-paper hero-paper-middle" />
            <div className="hero-paper hero-paper-front">
              <div className="flex items-center justify-between border-b border-white/15 pb-5">
                <span className="text-[10px] font-semibold tracking-[.2em] text-white/50">
                  BAĞIMSIZ ÇALIŞAN ARŞİVİ
                </span>
                <FileText className="h-5 w-5 text-brand-light" />
              </div>
              <p
                className={
                  displayFont.className +
                  " mt-6 text-[46px] font-extrabold uppercase leading-[1.05] tracking-tight"
                }
              >
                ÖNCE BELGE.
                <br />
                <span className="text-accent">SONRA YAYIN.</span>
              </p>
              <div className="hero-paper-lines">
                <span />
                <span />
                <span />
              </div>
              <div className="mt-7 flex items-center gap-3 border-t border-white/15 pt-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-brand-light/35 bg-brand/10">
                  <ShieldCheck className="h-5 w-5 text-brand-light" />
                </span>
                <span className="text-xs leading-5 text-white/65">
                  Somut dayanak.
                  <br />
                  Bağımsız inceleme.
                </span>
              </div>
            </div>
            <div className="hero-archive-tag">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              SÖZÜNÜN ARKASINDA BELGEN OLSUN.
            </div>
          </div>
        </div>
        <div className="hero-bottomline">
          <span>
            <ShieldCheck className="h-4 w-4 text-brand-light" /> Belgeye dayalı
            yayın
          </span>
          <span>İncelenmeden yayımlanmaz.</span>
        </div>
      </div>
    </section>
  );
}
