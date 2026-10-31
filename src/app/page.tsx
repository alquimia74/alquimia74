import { Hero } from "@/components/home/Hero";
import Link from "next/link";
import {
  ChevronRight,
  FileCheck2,
  MessageSquare,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import { getAllExperiences } from "@/lib/server/experiences";
import { JsonLd } from "@/components/seo/JsonLd";
import { config } from "@/lib/config";
import { generateMeta } from "@/lib/seo";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";

export const metadata = generateMeta({
  title: "Yetiş+ Çarşı Çalışan Şikâyetleri | yetişikayet.com",
  description:
    "Hızır Global A.Ş. bünyesindeki Yetiş+ Çarşı hakkında çalışan şikâyetleri: ücret, sigorta ve çalışma koşullarına ilişkin belge odaklı bağımsız arşiv.",
  path: "/",
});
const principles = [
  {
    icon: MessageSquare,
    title: "Şikâyetini yaz",
    text: "Başlığını, yaşadıklarını, ilini ve kadro türünü belirt.",
  },
  {
    icon: FileCheck2,
    title: "Belgelerini e-postala",
    text: "Şikâyet başlığını belirterek belgelerini e-postadan ilet.",
  },
  {
    icon: ShieldCheck,
    title: "İnceleme ve yayın onayı",
    text: "Yalnızca somut dayanağı incelenen içerik onaylanır.",
  },
];
export default async function HomePage() {
  const complaints = await getAllExperiences();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": config.siteUrl + "/#website",
          name: config.siteName,
          alternateName: "Yetişikayet",
          inLanguage: "tr-TR",
          url: config.siteUrl,
          description: "Yetiş+ Çarşı çalışan şikâyetleri için bağımsız arşiv",
          about: {
            "@type": "Brand",
            name: "Yetiş+ Çarşı",
            url: "https://yetisplus.com/",
          },
        }}
      />
      <Hero />
      <div className="container-main mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] md:mt-8">
        <section aria-labelledby="complaints-title">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="complaints-title" className="section-title">
              Şikâyetler ve anlatımlar
            </h2>
            <Link href="/deneyimler" className="link-more">
              Tümü <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {complaints.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-muted">
            Yetiş+ Çarşı’da yaşanan bir çalışma deneyiminden doğan bağımsız
            arşiv. Şikâyetleri belgeleriyle bir araya getiriyoruz.{" "}
            <Link className="font-bold text-brand" href="/hakkimizda">
              Hikâyemiz
            </Link>
          </p>
        </section>
        <aside className="space-y-5">
          <div className="overflow-hidden rounded-xl bg-navy p-6 text-white">
            <span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-white/10">
              <PenLine className="h-5 w-5 text-accent" />
            </span>
            <h2 className="text-xl font-extrabold">
              Sen de benzer bir sorun yaşadın mı?
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/80">
              Kısaca anlat. Belgelerini şikâyet başlığıyla e-postadan ilet.
            </p>
            <Link
              href="/deneyimini-paylas"
              className="btn btn-primary mt-5 w-full"
            >
              Şikâyet yaz
            </Link>
          </div>
          <div className="card p-5">
            <h2 className="font-extrabold text-navy">
              Yetiş+ Çarşı ve Hızır Global A.Ş.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Yetiş+ Çarşı’nın kurumsal bağlamı ve diğer markalar.
            </p>
            <Link href="/kurumlar" className="link-more mt-3">
              Kurumlar ve markalar <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
      <section className="container-main mt-10">
        <h2 className="section-title mb-4">
          Bir şikâyet nasıl yayına hazırlanır?
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="card p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold text-subtle">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-extrabold text-navy">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
