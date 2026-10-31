import { generateMeta } from "@/lib/seo";
import { InfoLayout } from "@/components/common/InfoLayout";
import { config } from "@/lib/config";
export const metadata = generateMeta({
  title: "Yayın ilkeleri",
  description: "Belge olmadan içerik onayı verilmez.",
  path: "/yayin-ilkeleri",
});
export default function Page() {
  return (
    <InfoLayout
      path="/yayin-ilkeleri"
      title="Yayın ilkeleri"
      lead="Belge olmadan içerik onayı verilmez."
    >
      <div className="card prose-yv p-6 md:p-8">
        <h2 className="!mt-0">Çalışan şikâyeti</h2>
        <p>
          Yalnızca birinci elden anlatım ve somut dayanak birlikte
          değerlendirilir. Belgeler, şikâyet başlığı belirtilerek{" "}
          <a
            href={"mailto:" + config.contactEmail}
            className="font-bold text-brand"
          >
            {config.contactEmail}
          </a>{" "}
          adresine gönderilir. Şikâyetler moderasyon tarafından incelenmeden ve
          belgelerin doğruluğu araştırılmadan yayımlanmaz.
        </p>
        <h2 id="yanit-itiraz">İşveren yanıtı</h2>
        <p>
          İşveren de yanıtını belgelemek zorundadır. İncelenmiş bir kaydın
          aksini ileri süren yanıt, o kaydın dayanaklarını somut biçimde
          karşılayan ve açıklığa kavuşturan belge sunmalıdır. Salt inkâr, unvan
          veya şirket politikası yayın kararının yerine geçmez. Belgesiz yanıt
          yayımlanmaz; salt itiraz nedeniyle şikâyet yayından kaldırılmaz.
        </p>
        <h2>Belge paylaşımı</h2>
        <p>
          Belgeler iznin olmadan paylaşılmaz. Yayımlanmasına izin verdiğin
          belgeler, kişisel bilgiler gizlenerek şikâyetin veya yanıtın altında
          bağlantı olarak sunulur.
        </p>
        <h2>İnceleme ve resmî başvuru</h2>
        <p>
          Somut hata, kişisel veri veya hak ihlali bildirimleri ayrıca ele
          alınır; gerekli düzeltme, geçici sınırlandırma veya kaldırma yapılır.
          Yetkili mercilere doğrudan başvurma hakkı saklıdır; bağlayıcı kararlar
          yerine getirilir. Yayıncı incelemesi bir mahkeme kararı değildir.
        </p>
      </div>
    </InfoLayout>
  );
}
