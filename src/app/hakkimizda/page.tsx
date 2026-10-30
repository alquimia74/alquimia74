import { generateMeta } from "@/lib/seo";
import { Shield, Eye, Users, MessageSquare } from "lucide-react";
import { InfoLayout } from "@/components/common/InfoLayout";

export const metadata = generateMeta({
  title: "Hakkımızda",
  description: "YetişVar, bağımsız bir çalışan deneyimleri platformu olarak neden ve nasıl oluşturulduğunu açıklıyoruz.",
  path: "/hakkimizda",
});

const values = [
  { icon: Shield, title: "Bağımsızlık", desc: "Platform herhangi bir şirkete, siyasi gruba veya çıkar grubuna bağlı değildir." },
  { icon: Eye, title: "Şeffaflık", desc: "Yayın sürecimiz ve moderasyon ilkelerimiz kamuya açıktır." },
  { icon: Users, title: "Gizlilik", desc: "Başvuru sahiplerinin kimlik bilgilerini korumayı en temel önceliğimiz olarak görürüz." },
  { icon: MessageSquare, title: "Denge", desc: "Adı geçen kurumlara ve kişilere cevap ve düzeltme talebi kanalı sunuyoruz." },
];

export default function HakkimizdaPage() {
  return (
    <InfoLayout
      path="/hakkimizda"
      title="Hakkımızda"
      lead="YetişVar, çalışma deneyimlerini kayıt altına alan bağımsız bir platformdur."
    >
      <div className="card prose-yv p-6 md:p-8">
        <p className="text-base text-ink">
          YetişVar, Yetiş+ Çarşı, Hızır Global A.Ş. ve ilgili faaliyetlerde çalışma deneyimi yaşamış
          kişilerin anlatımlarını kayıt altına almak amacıyla oluşturulmuş bağımsız bir platformdur.
        </p>
        <p>
          Bu platform bir şikâyet sitesi değildir. Belirli şirket veya kişilere karşı suç işlendiğini
          peşinen kabul etmez. Amacımız, benzer deneyimleri yaşayan bireylerin sesini duyurmasına zemin
          hazırlamak ve kamuoyunun bilgilenmesine katkıda bulunmaktır.
        </p>
        <p>
          Yayımladığımız her içerik editöryal incelemeden geçer. Başvuru sahiplerinin birinci elden
          anlattıkları ile belgelerin varlığı açıkça ayrıştırılır. İddia niteliğindeki ifadeler,
          doğrulanmış gerçeklerden ayrı tutulur.
        </p>
        <p>
          Platform başvuru sahiplerinin kişisel verilerini korumayı esas alır. Adı geçen kurumlara ve
          ilgili kişilere cevap, düzeltme veya içerik kaldırma talebi için ayrı bir kanal sunulur.
        </p>
      </div>

      <h2 className="section-title mb-4 mt-8">Temel İlkelerimiz</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {values.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card flex gap-4 p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-navy">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 rounded-xl bg-navy-soft p-5 text-sm leading-6 text-muted">
        <strong className="text-navy">Not:</strong> YetişVar, Yetiş+ Çarşı, Hızır Global A.Ş.,
        Şikayetvar veya bu isimlerle ilişkili herhangi bir şirketin resmî hizmeti değildir. Platform
        tamamen bağımsız olarak faaliyet göstermektedir.
      </p>
    </InfoLayout>
  );
}
