import Link from "next/link";
import { PenLine } from "lucide-react";
import { Logo } from "./Logo";
import { config } from "@/lib/config";

const PLATFORM = [
  { href: "/deneyimler", label: "Tüm Şikâyetler" },
  { href: "/deneyimini-paylas", label: "Şikâyet yaz" },
  { href: "/kurumlar", label: "Kurumlar ve Markalar" },
  { href: "/nasil-calisir", label: "Nasıl Çalışır?" },
];

const KURUMSAL = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/yayin-ilkeleri", label: "Yayın İlkeleri" },
  { href: "/sikca-sorulan-sorular", label: "SSS" },
  { href: "/iletisim", label: "İletişim" },
];

const LEGAL = [
  { href: "/gizlilik", label: "Gizlilik Politikası" },
  { href: "/kvkk-aydinlatma", label: "KVKK Aydınlatma Metni" },
  { href: "/yayin-ilkeleri", label: "Topluluk Kuralları" },
  { href: "/iletisim", label: "İçerik inceleme" },
];

function Column({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-extrabold text-navy">{title}</h3>
      <ul className="space-y-2.5">
        {links.map(({ href, label }) => (
          <li key={href + label}>
            <Link
              href={href}
              className="text-sm text-muted transition-colors hover:text-brand"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-10 border-t border-line bg-white md:mt-16">
      {/* CTA şeridi */}
      <div className="bg-brand">
        <div className="container-main flex flex-col items-start justify-between gap-4 py-6 text-white sm:flex-row sm:items-center">
          <div>
            <p className="text-lg font-extrabold">
              Yetiş&apos;e dair anlatacakların mı var?
            </p>
            <p className="text-sm text-white/80">
              Yaşadıklarını tarihleri ve belgeleriyle bir araya getir.
            </p>
          </div>
          <Link
            href="/deneyimini-paylas"
            className="btn bg-white text-brand hover:bg-brand-soft"
          >
            <PenLine className="h-4 w-4" /> Şikâyet yaz
          </Link>
        </div>
      </div>

      <div className="container-main grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="col-span-2 lg:col-span-1">
          <Logo height={44} />
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
            Hızır Global A.Ş. bünyesinde yer alan Yetiş+ Çarşı hakkında çalışan
            şikâyetlerini bir araya getiren bağımsız arşiv.
          </p>
        </div>
        <Column title="Platform" links={PLATFORM} />
        <Column title="Arşiv" links={KURUMSAL} />
        <Column title="Bilgi ve Haklar" links={LEGAL} />
      </div>

      <div className="border-t border-line bg-page">
        <div className="container-main flex flex-col items-center justify-between gap-2 py-5 text-xs text-subtle sm:flex-row">
          <p>© 2026 {config.siteName}. Her hakkı saklıdır.</p>
          <p>Bu platform, adı geçen şirketlerin resmî hizmeti değildir.</p>
        </div>
      </div>
    </footer>
  );
}
