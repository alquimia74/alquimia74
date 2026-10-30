import Link from "next/link";
import {
  ChevronRight,
  ClipboardCheck,
  FileText,
  Megaphone,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import { getAllExperiences } from "@/data/mock-experiences";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { config } from "@/lib/config";
import { getEntityRanking, getPlatformStats, sortByNewest } from "@/lib/stats";
import { SearchBox } from "@/components/common/SearchBox";
import { EntityLogo } from "@/components/common/Avatar";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";

export const metadata = generateMeta({
  title: "YetişVar | Çalışan Deneyimleri Platformu",
  description: "Yetiş+ Çarşı ve Hızır Global A.Ş. çalışma deneyimlerini kayıt altına alan bağımsız platform.",
  path: "/",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: config.siteName,
  url: config.siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${config.siteUrl}/deneyimler?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const STEPS = [
  { icon: PenLine,         title: "Deneyimini yaz",     text: "Kurum ve dönem bilgileriyle yaşadığını adım adım anlat." },
  { icon: ClipboardCheck,  title: "Editör incelesin",   text: "Yayın ilkeleri ve hukuki riskler açısından insan editör kontrol eder." },
  { icon: Megaphone,       title: "Yayına alınsın",     text: "Onaylanan deneyim kurum sayfasında yer alır, herkes okuyabilir." },
];

export default function HomePage() {
  const latest = sortByNewest(getAllExperiences());
  const ranking = getEntityRanking();
  const stats = getPlatformStats();

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-dark">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-navy/20"
        />
        <div className="container-main relative py-8 text-center md:py-16">
          <h1 className="text-[26px] font-black leading-tight tracking-tight text-white sm:text-3xl md:text-[44px]">
            Çalışma deneyimi için <span className="text-accent">YetişVar</span>
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/85 sm:text-base md:mt-3 md:text-lg">
            Yetiş+ Çarşı, Hızır Global A.Ş. ve ilgili kurumlardaki çalışan deneyimlerini ara, oku, paylaş.
          </p>
          <SearchBox size="lg" className="mx-auto mt-6 max-w-2xl md:mt-8" />
        </div>
      </section>

      {/* ── Gündem + yan sütun ── */}
      <div className="container-main mt-6 grid grid-cols-1 gap-6 md:mt-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="gundem">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="gundem" className="section-title">Gündemdeki Deneyimler</h2>
            <Link href="/deneyimler" className="link-more shrink-0">
              <span className="hidden sm:inline">Tüm Deneyimler</span>
              <span className="sm:hidden">Tümü</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {latest.slice(0, 6).map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
          <div className="mt-5 text-center">
            <Link href="/deneyimler" className="btn btn-outline">
              Daha fazla deneyim gör
            </Link>
          </div>
        </section>

        <aside className="space-y-6">
          {/* Deneyim yaz kutusu */}
          <div className="card overflow-hidden">
            <div className="bg-navy p-5 text-white">
              <p className="text-lg font-extrabold leading-snug">
                Yetiş&apos;e dair <span className="text-accent">anlatacakların</span> mı var?
              </p>
              <p className="mt-1.5 text-sm text-white/75">
                Kimliğin gizli kalır. Her deneyim yayından önce editör incelemesinden geçer.
              </p>
              <Link href="/deneyimini-paylas" className="btn btn-primary mt-4 w-full">
                <PenLine className="h-4 w-4" /> Deneyim Yaz
              </Link>
            </div>
          </div>

          {/* Çok konuşulan kurumlar */}
          <div className="card">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-base font-extrabold text-navy">Çok Konuşulan Kurumlar</h2>
              <Link href="/kurumlar" className="text-xs font-bold text-brand">Tümü</Link>
            </div>
            <ol className="divide-y divide-line">
              {ranking.map(({ entity, count }, i) => (
                <li key={entity.id}>
                  <Link
                    href={`/kurumlar/${entity.slug}`}
                    className="group flex items-center gap-3 px-5 py-3 hover:bg-page"
                  >
                    <span className="w-5 text-center text-sm font-black text-subtle">{i + 1}</span>
                    <EntityLogo name={entity.name} size={36} className="rounded-lg" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-ink group-hover:text-brand">
                        {entity.name}
                      </span>
                      <span className="text-xs text-subtle">{count} deneyim</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-subtle" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>

      {/* ── Sayılarla ── */}
      <section className="container-main mt-12">
        <div className="rounded-2xl bg-navy px-6 py-8 md:px-10">
          <h2 className="text-center text-xl font-extrabold text-white">Sayılarla YetişVar</h2>
          <dl className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: stats.experiences, label: "Yayımlanan deneyim" },
              { value: stats.entities,    label: "Listelenen kurum" },
              { value: stats.cities,      label: "Farklı şehir" },
              { value: "%100",            label: "Editör kontrollü yayın" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-3xl font-black text-accent md:text-4xl">{s.value}</dd>
                <dd className="mt-1 text-sm text-white/75">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Kurumlar ── */}
      <section className="container-main mt-12" aria-labelledby="kurumlar">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="kurumlar" className="section-title">Kurumlar</h2>
          <Link href="/kurumlar" className="link-more">
            Tüm Kurumlar <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ranking.map(({ entity, count }) => (
            <Link
              key={entity.id}
              href={`/kurumlar/${entity.slug}`}
              className="card card-hover flex flex-col items-center p-5 text-center"
            >
              <EntityLogo name={entity.name} size={56} />
              <span className="mt-3 line-clamp-1 text-sm font-bold text-ink">{entity.name}</span>
              <span className="text-xs text-subtle">{count} deneyim</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Nasıl çalışır ── */}
      <section className="container-main mt-12" aria-labelledby="surec">
        <h2 id="surec" className="section-title mb-4">Nasıl Çalışır?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="card flex gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-subtle">ADIM {i + 1}</p>
                <h3 className="font-extrabold text-navy">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Kurumlara çağrı ── */}
      <section className="container-main mt-12">
        <div className="card flex flex-col items-start gap-5 p-6 md:flex-row md:items-center md:p-8">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-navy-soft text-navy">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <h2 className="text-lg font-extrabold text-navy">Adı geçen kurum musunuz?</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Yayımlanan içeriklere cevap, düzeltme veya kaldırma talebinizi iletebilirsiniz.
              Tüm talepler editöryal olarak değerlendirilir.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/yayin-ilkeleri" className="btn btn-secondary">
              <FileText className="h-4 w-4" /> Yayın İlkeleri
            </Link>
            <Link href="/iletisim" className="btn btn-navy">Cevap Hakkı</Link>
          </div>
        </div>
      </section>
    </>
  );
}
