import { generateMeta } from "@/lib/seo";
import { InfoLayout } from "@/components/common/InfoLayout";
import { config } from "@/lib/config";
export const metadata = generateMeta({
  title: "Gizlilik",
  description: "Kişisel bilgilerini koruyarak yaşadıklarını paylaş.",
  path: "/gizlilik",
});
export default function Page() {
  return (
    <InfoLayout
      path="/gizlilik"
      title="Gizlilik"
      lead="Kişisel bilgilerini koruyarak yaşadıklarını paylaş."
    >
      <div className="card prose-yv p-6 md:p-8">
        <h2 className="!mt-0">Metinler</h2>
        <p>
          Önizlediğin metin kendiliğinden yayımlanmaz. Paylaşmadan önce kendine
          ve başkalarına ait kimlik, iletişim ve banka bilgilerini metinden
          çıkar. Gönderdiğin içerik inceleme için saklanır; yalnızca onaylanan
          metinler ve paylaşılmasına izin verdiğin belge kopyaları sitede
          görünür.
        </p>
        <h2>Belgeler</h2>
        <p>
          Çalışan ve işveren belgeleri formdan yüklenmez; ilgili şikâyetin
          başlığı belirtilerek{" "}
          <a
            href={"mailto:" + config.contactEmail}
            className="font-bold text-brand"
          >
            {config.contactEmail}
          </a>{" "}
          adresine gönderilir. E-posta içeriği, kullanılan e-posta hizmetlerinin
          veri işlemesine tabidir.
        </p>
        <h2>Kamuya açık kopya</h2>
        <p>
          İnceleme belgesi ile yayımlanabilir kopya ayrıdır. Paylaşım yetkisi ve
          kişisel bilgi gizleme kontrolü yapılmadan belge bağlantısı eklenmez.
          Ham belgeler açık arşive konulmaz.
        </p>
        <h2>Müzik</h2>
        <p>
          Oynat düğmesine bastığında YouTube hizmetine bağlantı kurulur. Müzik
          kendiliğinden başlamaz.
        </p>
      </div>
    </InfoLayout>
  );
}
