import { generateMeta } from "@/lib/seo";
import { InfoLayout } from "@/components/common/InfoLayout";
export const metadata = generateMeta({
  title: "Sık sorulan sorular",
  description: "Başvuru, belge gönderimi ve yayın süreci.",
  path: "/sikca-sorulan-sorular",
});
const questions = [
  {
    q: "Hangi marka için şikâyet yazabilirim?",
    a: "Yalnızca Yetiş+ Çarşı çalışma deneyimin için. Diğer Hızır Global A.Ş. markaları kurumlar rehberinde bilgi amacıyla yer alır.",
  },
  {
    q: "Belgemi nasıl ileteceğim?",
    a: "Şikâyet başlığını belirterek yetisikayet@proton.me adresine gönder. Formda belge yüklenmez.",
  },
  {
    q: "Şikâyet hemen yayımlanır mı?",
    a: "Hayır. Metin ve somut dayanaklar incelenir; yayıncı onayından sonra yayımlanır.",
  },
  {
    q: "Belgem herkese gösterilir mi?",
    a: "Her belge yayımlanmaz. Yayıncı yalnızca paylaşım yetkisi kontrol edilmiş ve kişisel bilgileri gizlenmiş kopyayı ilgili kayda ekler.",
  },
  {
    q: "İşveren yanıt verebilir mi?",
    a: "Şikâyetin altındaki Yanıt ver bağlantısını kullanır. Yanıtın yayımlanması için dayanak belgeleri e-postayla iletmesi gerekir.",
  },
  {
    q: "İtiraz veya kaldırma talebi nasıl iletilir?",
    a: "İlgili başlık/bağlantı ve somut dayanaklarla yetisikayet@proton.me adresine yazılır. Hak ihlali bildirimleri incelenir; resmî başvuru hakkı saklıdır.",
  },
];
export default function Page() {
  return (
    <InfoLayout path="/sikca-sorulan-sorular" title="Sık sorulan sorular">
      <div className="card divide-y divide-line">
        {questions.map((item) => (
          <details className="p-5" key={item.q}>
            <summary className="cursor-pointer text-sm font-bold text-navy">
              {item.q}
            </summary>
            <p className="mt-3 text-sm leading-7 text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </InfoLayout>
  );
}
