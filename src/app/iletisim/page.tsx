import { generateMeta } from "@/lib/seo";
import { InfoLayout } from "@/components/common/InfoLayout";
import { config } from "@/lib/config";
export const metadata = generateMeta({
  title: "İletişim",
  description: "Belge, düzeltme ve içerik inceleme talepleri.",
  path: "/iletisim",
});
export default function Page() {
  return (
    <InfoLayout
      path="/iletisim"
      title="İletişim"
      lead="Belge, düzeltme ve içerik inceleme talepleri."
    >
      <div className="card prose-yv p-6 md:p-8">
        <p>
          <a
            className="text-lg font-bold text-brand"
            href={"mailto:" + config.contactEmail}
          >
            {config.contactEmail}
          </a>
        </p>
        <h2>Belge ve ek açıklama</h2>
        <p>
          İlgili şikâyetin bağlantısıyla birlikte gönderin. Belgeler doğrudan
          yayımlanmaz; yayıncı tarafından incelenir.
        </p>
        <h2>İtiraz veya kaldırma talebi</h2>
        <p>
          İtiraz ettiğiniz ifadeyi, talep ettiğiniz işlemi ve somut dayanağınızı
          e-postayla iletin. Hata veya hak ihlali tespit edilirse gerekli
          düzeltme, sınırlandırma ya da kaldırma yapılır. Salt talep, bir kaydı
          otomatik değiştirmez.
        </p>
        <p>
          Resmî mercilere başvurma hakkınız saklıdır. Bu incelemeyi beklemeniz
          gerekmez.
        </p>
      </div>
    </InfoLayout>
  );
}
