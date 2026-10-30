import { ChevronDown } from "lucide-react";
import { generateMeta } from "@/lib/seo";
import { InfoLayout } from "@/components/common/InfoLayout";

export const metadata = generateMeta({
  title: "Sık Sorulan Sorular",
  description: "YetişVar hakkında sık sorulan sorular ve yanıtları.",
  path: "/sikca-sorulan-sorular",
});

const faqs = [
  { q: "YetişVar nedir?", a: "YetişVar, Yetiş+ Çarşı, Hızır Global A.Ş. ve ilgili faaliyetlerde çalışma deneyimi yaşamış kişilerin anlatımlarını kayıt altına alan bağımsız bir platformdur. Herhangi bir şirketin resmî hizmeti değildir." },
  { q: "Başvurumun gerçekten okunup inceleneceğini nasıl bilirim?", a: "Tüm başvurular insan editörleri tarafından yayın ilkelerimize göre değerlendirilir. Otomatik yayın yapılmaz. İnceleme süreci yoğunluğa göre değişebilir." },
  { q: "Anonim başvuru yapabilir miyim?", a: "Evet. Başvuru tercihi olarak 'Takma adımla yayımlansın' veya 'Yalnızca editör incelemesine açık kalsın' seçeneklerini kullanabilirsiniz." },
  { q: "Belgemi eklemek zorunda mıyım?", a: "Hayır. Belge ekleme tamamen isteğe bağlıdır. Belgesiz anlatımlar da kabul edilebilir; ancak yayımlanan içerikte doğrulama durumu açıkça belirtilir." },
  { q: "Adım geçen bir içeriğin kaldırılmasını nasıl talep ederim?", a: "İletişim sayfamız üzerinden cevap, düzeltme veya kaldırma talebinde bulunabilirsiniz. Talepler editöryal değerlendirmeye tabi tutulur." },
  { q: "Platform Şikayetvar ile bağlantılı mı?", a: "Hayır. YetişVar, Şikayetvar veya herhangi bir şikâyet platformuyla hiçbir ilişkisi olmayan tamamen bağımsız bir platformdur." },
  { q: "Bu site demo mu yoksa gerçek mi?", a: "Şu an geliştirme ve test aşamasındayız. Göreceğiniz deneyimler temsili demo içeriktir. Gerçek başvuru sistemi aktif olduğunda bu sayfa güncellenecektir." },
];

export default function SSSPage() {
  return (
    <InfoLayout
      path="/sikca-sorulan-sorular"
      title="Sık Sorulan Sorular"
      lead="Aklınıza takılan soruların yanıtlarını burada bulabilirsiniz."
    >
      <div className="card divide-y divide-line">
        {faqs.map((faq) => (
          <details key={faq.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 select-none hover:bg-page [&::-webkit-details-marker]:hidden">
              <span className="text-sm font-bold text-ink group-open:text-brand">{faq.q}</span>
              <ChevronDown className="h-5 w-5 shrink-0 text-subtle transition-transform group-open:rotate-180 group-open:text-brand" />
            </summary>
            <p className="px-5 pb-5 text-sm leading-6 text-muted">{faq.a}</p>
          </details>
        ))}
      </div>
    </InfoLayout>
  );
}
