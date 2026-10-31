import { generateMeta } from "@/lib/seo";
import { InfoLayout } from "@/components/common/InfoLayout";
import { config } from "@/lib/config";
export const metadata = generateMeta({
  title: "Kişisel veriler",
  description: "Gerekli bilgiyle sınırlı başvuru ve kontrollü yayın.",
  path: "/kvkk-aydinlatma",
});
export default function Page() {
  return (
    <InfoLayout
      path="/kvkk-aydinlatma"
      title="Kişisel veriler"
      lead="Gerekli bilgiyle sınırlı başvuru ve kontrollü yayın."
    >
      <div className="card prose-yv p-6 md:p-8">
        <p>
          Kişisel bilgileri şikâyet metnine yazma. İl ve kadro türü, çalışma
          deneyiminin bağlamını açıklamak için kullanılır.
        </p>
        <p>
          Belgeler yalnızca{" "}
          <a
            href={"mailto:" + config.contactEmail}
            className="font-bold text-brand"
          >
            {config.contactEmail}
          </a>{" "}
          adresine, ilgili başlıkla gönderilir. İnceleme için gereksiz kimlik
          belgesi, sağlık bilgisi veya üçüncü kişilere ait veri iletme.
        </p>
        <p>
          Bir belgenin incelenmesi, açık yayına izin verildiği anlamına gelmez.
          Gizlenmiş kopya ve paylaşım yetkisi ayrıca kontrol edilir. Kamuya açık
          bir içerikle ilgili kişisel veri, düzeltme veya kaldırma talebini aynı
          adrese ilgili bağlantıyla iletebilirsin.
        </p>
      </div>
    </InfoLayout>
  );
}
