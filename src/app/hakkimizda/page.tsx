import { generateMeta } from "@/lib/seo";
import { InfoLayout } from "@/components/common/InfoLayout";
import { config } from "@/lib/config";
export const metadata = generateMeta({
  title: "Hikâyemiz",
  description: "Yaşananları anlatmak ve kayda geçirmek için.",
  path: "/hakkimizda",
});
export default function Page() {
  return (
    <InfoLayout
      path="/hakkimizda"
      title="Hikâyemiz"
      lead="Yaşananları anlatmak ve kayda geçirmek için."
    >
      <div className="card prose-yv p-6 md:p-8">
        <p>
          yetişikayet.com, Yetiş+ Çarşı’da çalışırken mağduriyet yaşamış bir
          çalışan tarafından kurulmuştur. Dağınık halde bulunan şikâyetleri bir
          araya getirmek ve ne yapacağını bilemeyen çalışanlara yaşadıklarını
          anlatabilecekleri sade bir alan sunmak için vardır.
        </p>
        <p>
          Şikâyetlerin odağı Yetiş+ Çarşı’dır. Çalışanlar, Hızır Global A.Ş.
          çatısı altındaki Yetiş+ Çarşı markasında görev yapmak üzere işe alınan
          iştirak veya merkez kadro çalışanlarıdır. Diğer marka adları kurumsal
          bağlamı açıklamak için kurumlar rehberinde yer alır.
        </p>
        <p>
          Yalnızca somut dayanağı incelenen içerikler onaylanır. Aynı ölçüt
          çalışan şikâyeti ve işveren yanıtı için de geçerlidir. İletişim:{" "}
          <a
            href={"mailto:" + config.contactEmail}
            className="font-bold text-brand"
          >
            {config.contactEmail}
          </a>
          .
        </p>
      </div>
    </InfoLayout>
  );
}
