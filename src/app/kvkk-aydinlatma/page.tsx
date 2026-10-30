import { generateMeta } from "@/lib/seo";
import { DraftNotice, InfoLayout } from "@/components/common/InfoLayout";

export const metadata = generateMeta({
  title: "KVKK Aydınlatma Metni",
  description: "YetişVar KVKK aydınlatma metni taslağı.",
  path: "/kvkk-aydinlatma",
});

export default function KvkkPage() {
  return (
    <InfoLayout path="/kvkk-aydinlatma" title="KVKK Aydınlatma Metni">
      <DraftNotice>
        <strong>Taslak Metin:</strong> Bu metin KVKK kapsamında hukukçu tarafından incelenmemiştir.
        Veri sorumlusu bilgileri ve işleme amaçları henüz netleştirilmemiştir. Kesinleşmeden
        yayına alınmaması önerilir.
      </DraftNotice>

      <div className="card prose-yv p-6 md:p-8">
        <h2 className="!mt-0">Veri Sorumlusu</h2>
        <p>
          YetişVar platformunu işleten kişi/kuruluş 6698 sayılı Kişisel Verilerin Korunması Kanunu
          uyarınca veri sorumlusu sıfatıyla hareket etmektedir. Veri sorumlusuna ilişkin bilgiler
          gerçek başvuru alınmadan önce netleştirilecektir.
        </p>

        <h2>İşlenen Kişisel Veriler</h2>
        <p>
          Başvuru formu aracılığıyla iletilen anlatım metinleri, isteğe bağlı belgeler ve tercih
          bilgileri işlenebilir. Başvuru sahibinin açıkça girmediği veriler toplanmaz.
        </p>

        <h2>İşleme Amaçları ve Hukuki Dayanak</h2>
        <p>
          Veriler platformun editoryal süreçlerinin yürütülmesi amacıyla işlenir. Hukuki dayanak
          KVKK madde 5/2 kapsamında meşru menfaat ve açık rıza olarak değerlendirilmesi
          planlanmaktadır. Bu husus hukuki danışmanlık sonrası netleştirilecektir.
        </p>

        <h2>İlgili Kişilerin Hakları</h2>
        <p>
          KVKK madde 11 uyarınca kişisel verilerinize erişim, düzeltme, silme ve işlemenin
          kısıtlanmasını talep etme haklarınız mevcuttur. Bu haklarınızı kullanmak için iletişim
          kanalımıza başvurabilirsiniz.
        </p>
      </div>
    </InfoLayout>
  );
}
