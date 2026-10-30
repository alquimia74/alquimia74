import Link from "next/link";
import { CheckCircle2, EyeOff, ShieldCheck } from "lucide-react";
import { generateMeta } from "@/lib/seo";
import { SubmissionForm } from "@/components/forms/SubmissionForm";
import { Breadcrumb } from "@/components/common/Breadcrumb";

export const metadata = generateMeta({
  title: "Deneyimini Paylaş",
  description:
    "Yetiş+ Çarşı veya Hızır Global A.Ş. ile ilgili çalışma deneyiminizi bağımsız platformumuzda kayıt altına alın.",
  path: "/deneyimini-paylas",
});

const TIPS = [
  "Yalnızca bizzat yaşadığın olayları anlat.",
  "Tarih, tutar ve yazışma gibi somut ayrıntılar ekle.",
  "Hakaret, tehdit ve üçüncü kişilerin özel bilgilerinden kaçın.",
  "Kişisel verilerini metne yazma; editörlerimiz gerekirse ulaşır.",
];

export default function DeneyiminiPaylasPage() {
  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="container-main py-6">
          <Breadcrumb items={[{ label: "Deneyim Yaz" }]} />
          <h1 className="mt-3 text-2xl font-black text-navy">Deneyim Yaz</h1>
          <p className="mt-1 text-sm text-muted">
            Ücret, sigorta veya çalışma koşullarınla ilgili birinci elden deneyimini paylaş.
          </p>
        </div>
      </div>

      <div className="container-main mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <SubmissionForm />

        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-extrabold text-navy">
              <ShieldCheck className="h-5 w-5 text-brand" /> Yazmadan önce
            </h2>
            <ul className="mt-3 space-y-2.5">
              {TIPS.map((t) => (
                <li key={t} className="flex gap-2 text-sm leading-5 text-muted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {t}
                </li>
              ))}
            </ul>
            <Link href="/yayin-ilkeleri" className="link-more mt-4">Yayın ilkelerini oku</Link>
          </div>
          <div className="card flex gap-3 bg-navy p-5 text-white">
            <EyeOff className="h-5 w-5 shrink-0 text-accent" />
            <p className="text-sm leading-6 text-white/85">
              Kimliğin hiçbir zaman kurumlarla paylaşılmaz. Yayın tercihini son adımda sen belirlersin.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
