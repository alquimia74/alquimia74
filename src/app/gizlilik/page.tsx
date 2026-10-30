import { generateMeta } from "@/lib/seo";
import { DraftNotice, InfoLayout } from "@/components/common/InfoLayout";

export const metadata = generateMeta({
  title: "Gizlilik Politikası",
  description: "YetişVar gizlilik politikası taslağı.",
  path: "/gizlilik",
});

export default function GizlilikPage() {
  return (
    <InfoLayout path="/gizlilik" title="Gizlilik Politikası">
      <DraftNotice>
        <strong>Taslak Metin:</strong> Bu sayfa henüz hukukçu tarafından incelenmemiş bir taslaktır.
        Gerçek veri işleme süreçleri belirlenmeden bu metin hukuken onaylı olarak kabul edilmemelidir.
      </DraftNotice>

      <div className="card prose-yv p-6 md:p-8">
        <h2 className="!mt-0">1. Toplanan Veriler</h2>
        <p>
          Platform, başvuru formu aracılığıyla iletilen anlatım metinleri ve isteğe bağlı belgeleri
          işler. Başvuru sahiplerinin açıkça girmediği kişisel bilgiler toplanmaz. IP adresi ve
          tarayıcı verileri teknik amaçlarla kayıt altına alınabilir.
        </p>

        <h2>2. Verilerin Kullanımı</h2>
        <p>
          İletilen veriler yalnızca platformun editoryal süreçleri için kullanılır. Üçüncü taraflarla
          paylaşılmaz; resmi makamların hukuki talebi dışında herhangi bir kurum veya kişiyle iletilmez.
        </p>

        <h2>3. Başvuru Sahiplerinin Hakları</h2>
        <p>
          Başvuru sahipleri istedikleri zaman içeriklerinin kaldırılmasını, düzeltilmesini veya
          anonim hale getirilmesini talep edebilir. Bu talepler iletişim kanalımız aracılığıyla iletilir.
        </p>

        <h2>4. Çerezler</h2>
        <p>
          Platform yalnızca teknik işlevler için zorunlu çerezler kullanır. Üçüncü taraf reklam veya
          takip çerezleri kullanılmaz.
        </p>
      </div>
    </InfoLayout>
  );
}
