import { generateMeta } from "@/lib/seo";
import { DraftNotice, InfoLayout } from "@/components/common/InfoLayout";

export const metadata = generateMeta({
  title: "Yayın İlkeleri",
  description: "YetişVar'ın içerik yayın politikası, moderasyon ilkeleri ve itiraz mekanizması hakkında bilgi.",
  path: "/yayin-ilkeleri",
});

const principles = [
  { title: "Birinci Elden Deneyim", content: "Platformda yalnızca başvuru sahibinin bizzat yaşadığı olayların anlatımı kabul edilir. Üçüncü şahıslardan duyulan bilgiler, tahminler veya genel iddiaları içeren başvurular yayımlanmaz." },
  { title: "İddia ve Doğrulama Ayrımı", content: "Başvuru sahiplerinin anlatımları ile belgeyle desteklenmiş veya bağımsız olarak doğrulanmış bilgiler açıkça birbirinden ayrı gösterilir. Her içerikte doğrulama durumu belirtilir." },
  { title: "Belge İncelemesi", content: "Başvuru sahipleri isteğe bağlı olarak belge sunabilir. Belgeler anlatımı destekler nitelikte değerlendirilir; sahte veya yanıltıcı belge tespiti halinde başvuru reddedilir." },
  { title: "Özel Bilgilerin Korunması", content: "Başvuru sahiplerinin kimlik bilgileri, adres ve iletişim verileri gizli tutulur. Üçüncü şahısların özel bilgileri içeriğe dahil edilmez." },
  { title: "Hakaret ve Tehdit Yasağı", content: "Kişilere yönelik hakaret, iftira veya tehdit içeren ifadeler hiçbir koşulda yayımlanmaz. Belirtilen olayların anlatımı ile kişilik haklarına saldırı niteliğindeki ifadeler ayrıştırılır." },
  { title: "İtiraz ve Düzeltme", content: "Adı geçen kişi ve kurumlar içerik hakkında cevap, düzeltme veya kaldırma talebini iletişim kanalımız aracılığıyla iletebilir. Talepler editöryal değerlendirmeye tabi tutulur." },
  { title: "Başvuru Sahibinin Yayın Tercihi", content: "Başvuru sahipleri anlatımlarının anonim, takma adla veya yalnızca editör incelemesine açık biçimde yayımlanmasını talep edebilir. Bu tercih ileride değiştirilebilir." },
];

export default function YayinIlkeleriPage() {
  return (
    <InfoLayout
      path="/yayin-ilkeleri"
      title="Yayın İlkeleri"
      lead="Bu ilkeler platformun editoryal kararlarını yönlendiren çerçeveyi belirler. Başvuru sahiplerinin hakları, içerik kalitesi ve dengeli bir yaklaşım temel önceliklerimizdir."
    >
      <ol className="card divide-y divide-line">
        {principles.map((p, i) => (
          <li key={p.title} className="flex gap-4 p-5 md:p-6">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-black text-brand">
              {i + 1}
            </span>
            <div>
              <h2 className="font-extrabold text-navy">{p.title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted">{p.content}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6">
        <DraftNotice>
          Bu ilkeler platformun gelişimi sürecinde güncellenebilir. Güncel versiyona bu sayfadan ulaşabilirsiniz.
        </DraftNotice>
      </div>
    </InfoLayout>
  );
}
