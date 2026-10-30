import { generateMeta } from "@/lib/seo";
import Link from "next/link";
import { FileText, Upload, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { InfoLayout } from "@/components/common/InfoLayout";

export const metadata = generateMeta({
  title: "Nasıl Çalışır?",
  description: "YetişVar'da başvuru süreci, moderasyon aşamaları ve yayın politikası hakkında bilgi alın.",
  path: "/nasil-calisir",
});

const steps = [
  {
    icon: FileText,
    title: "Deneyimini Anlat",
    desc: "Çok adımlı formumuzu doldurarak ücret ödemeleri, sigorta kayıtları veya çalışma koşullarınla ilgili birinci elden deneyimini paylaş. Yalnızca bizzat yaşadığın olayları aktarmanı bekliyoruz.",
  },
  {
    icon: Upload,
    title: "İstersen Belgelerini Ekle",
    desc: "Maaş bordrosu, SGK çıktısı, yazışma veya sözleşme gibi belgeleri isteğe bağlı olarak ekleyebilirsin. Belgeler doğrulama sürecinde değerlendirilir; ancak anlatımından ayrı tutulur.",
  },
  {
    icon: Clock,
    title: "Başvurun İncelenir",
    desc: "Yayın ilkelerimize uygunluk açısından editöryal inceleme yapılır. Bu süreç biraz zaman alabilir. İçerik hakaret, tehdit veya üçüncü şahıs bilgisi içeriyorsa geri dönüş yapılır.",
  },
  {
    icon: CheckCircle,
    title: "Anlatımın Yayımlanır",
    desc: "Uygun bulunan anlatımlar tercihine göre anonim, takma adınla veya editör incelemesine açık olarak platformda yer alır. Her içerikte beyan niteliği açıkça belirtilir.",
  },
];

export default function NasilCalisirPage() {
  return (
    <InfoLayout
      path="/nasil-calisir"
      title="Nasıl Çalışır?"
      lead="Başvurudan yayına dört adım. Süreç şeffaf, gizliliğe saygılı ve editöryal denetim altındadır."
    >
      <ol className="card divide-y divide-line">
        {steps.map(({ icon: Icon, title, desc }, i) => (
          <li key={title} className="flex gap-5 p-6">
            <div className="flex flex-col items-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-white">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-subtle">ADIM {i + 1}</p>
              <h2 className="font-extrabold text-navy">{title}</h2>
              <p className="mt-1.5 text-sm leading-6 text-muted">{desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-xl bg-navy p-6 text-white">
        <h2 className="font-extrabold">Moderasyon Süreci Hakkında</h2>
        <p className="mt-2 text-sm leading-6 text-white/80">
          Tüm başvurular insan editörleri tarafından incelenir. Otomatik yayın yapılmaz. İnceleme
          süresi yoğunluğa göre değişebilir. Reddedilen başvurular için gerekçe belirtilir ve
          revizyon imkânı sunulabilir.
        </p>
        <Link href="/deneyimini-paylas" className="btn btn-primary mt-5">
          Hemen Başvur <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </InfoLayout>
  );
}
