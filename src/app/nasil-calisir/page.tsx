import { generateMeta } from "@/lib/seo";
import { InfoLayout } from "@/components/common/InfoLayout";
import { config } from "@/lib/config";
export const metadata = generateMeta({
  title: "Nasıl çalışır?",
  description:
    "Yaşadığını anlat, belgelerini gönder. İnceleyip onayladıktan sonra yayımlayalım.",
  path: "/nasil-calisir",
});
export default function Page() {
  return (
    <InfoLayout
      path="/nasil-calisir"
      title="Nasıl çalışır?"
      lead="Yaşadığını anlat, belgelerini gönder. İnceleyip onayladıktan sonra yayımlayalım."
    >
      <div className="card prose-yv p-6 md:p-8">
        <h2 className="!mt-0">1. Şikâyetini yaz</h2>
        <p>
          Başlığını, yaşadıklarını, çalıştığın ili ve kadro türünü belirt.
          Kişisel bilgilerini ve başkalarına ait özel bilgileri metne ekleme.
        </p>
        <h2>2. Belgelerini e-postayla gönder</h2>
        <p>
          Şikâyet başlığını belirterek belgelerini{" "}
          <a
            href={"mailto:" + config.contactEmail}
            className="font-bold text-brand"
          >
            {config.contactEmail}
          </a>{" "}
          adresine ilet.
        </p>
        <h2>3. İnceleme ve onay</h2>
        <p>
          Şikâyetin ve belgelerin moderasyon tarafından birlikte incelenir.
          Doğruluğu araştırılan ve yayın ilkelerine uygun bulunan içerikler
          onaylandıktan sonra yayımlanır. Belgelerin yalnızca paylaşılmasına
          izin verdiğin kopyaları, kişisel bilgiler gizlenerek eklenir.
        </p>
      </div>
    </InfoLayout>
  );
}
