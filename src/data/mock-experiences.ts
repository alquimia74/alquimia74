import { type Experience } from "@/types/experience";

export const mockExperiences: Experience[] = [
  {
    id: "exp-001",
    slug: "ucret-odemelerinde-gecikme-yasanan-donem",
    title: "Ücret Ödemelerinde Yaşanan Gecikmeler",
    summary:
      "Çalıştığım süre boyunca maaş ödemelerinin düzenli yapılmadığını, bazı aylarda 2-3 hafta gecikme yaşandığını gözlemledim.",
    content: `Yetiş+ Çarşı bünyesinde yaklaşık 8 ay boyunca çalıştım. Bu süre zarfında maaş ödemelerinin zaman zaman 2-3 haftalık gecikmelerle yapıldığına bizzat tanık oldum.

İlk üç ayda ödemeler düzenliydi. Ancak ilerleyen dönemde muhasebe departmanından gelen "banka işlemleri gecikiyor" açıklamalarıyla ödemeler sürekli ertelendi. Birçok çalışma arkadaşım da aynı sorunu yaşadığını dile getirdi.

İnsan Kaynakları birimiyle yaptığım görüşmelerde somut bir yanıt alamadım. Yazılı olarak bildirdiğim şikayetlere de resmi bir yanıt verilmedi.`,
    relatedEntity: "Yetiş+ Çarşı",
    entitySlug: "yetis-carsi",
    employmentStart: "2023-04",
    employmentEnd: "2023-12",
    publishedAt: "2024-02-15",
    role: "Saha Çalışanı",
    city: "İstanbul",
  },
  {
    id: "exp-002",
    slug: "sgk-kaydinda-farklilika-iliskin-anlatim",
    title: "SGK Kayıt Bildirimine İlişkin Gözlemler",
    summary:
      "Fiilen çalışmaya başladığım tarih ile SGK işe giriş bildirge tarihinin örtüşmediğini fark ettim.",
    content: `Hızır Global A.Ş. bünyesinde işe başladıktan yaklaşık iki hafta sonra SGK sistemini kontrol ettiğimde işe giriş bildirgemimin henüz yapılmadığını gördüm.

İnsan kaynakları departmanı ile iletişime geçtiğimde "sistem yoğunluğu" nedeniyle gecikme yaşandığı bilgisi verildi. Konuyu takip etmem sonucunda bildirge geriye dönük olarak yapıldı, ancak gerçek başlangıç tarihi yansıtılmadı.

Bu durumun kıdem ve ihbar tazminatı hesaplamaları açısından ileride sorun yaratıp yaratmayacağını sorguladım. Konuya ilişkin yazılı bir açıklama talep ettim.`,
    relatedEntity: "Hızır Global A.Ş.",
    entitySlug: "hazir-global",
    employmentStart: "2023-08",
    employmentEnd: "2024-01",
    publishedAt: "2024-03-02",
    role: "Ofis Çalışanı",
    city: "İstanbul",
  },
  {
    id: "exp-003",
    slug: "isten-cikis-sonrasi-ucret-alacagi",
    title: "İşten Çıkış Sonrası Alacak Durumu",
    summary:
      "İş akdinin sona ermesinin ardından son ay ücretim ve yıllık izin alacağımın ödenmesinde ciddi gecikmeler yaşandı.",
    content: `Yetiş Yemek biriminde kurye olarak çalıştıktan sonra iş akdim sona erdirildi. Yasal süre içinde ödenmesi gereken son maaşım ve birikmiş yıllık izin alacağım zamanında yatırılmadı.

İşten ayrılışımın ardından 45 gün geçmesine rağmen hesabıma herhangi bir ödeme yansımadı. Şirketin müşteri hizmetleri hattından bağlantı sağlamak oldukça güçleşti.

Nihayet 60. günde kısmi bir ödeme yapıldı. Yıllık izin ücreti ise hâlâ eksik kaldı. Konuyu ilgili arabuluculuk merkezine taşıdım.`,
    relatedEntity: "Yetiş Yemek",
    entitySlug: "yetis-yemek",
    employmentStart: "2023-11",
    employmentEnd: "2024-02",
    publishedAt: "2024-04-10",
    role: "Kurye",
    city: "Ankara",
  },
  {
    id: "exp-004",
    slug: "fazla-mesai-telafisi-sorunu",
    title: "Fazla Mesai Ücretlerinin Ödenmemesi",
    summary:
      "Haftada ortalama 50-55 saat çalıştım ancak sözleşmede belirtilen 45 saatin üzerindeki mesailer hiçbir zaman ödenmedi.",
    content: `Yetiş+ Çarşı'nın lojistik departmanında çalıştığım dönemde haftalık ortalama çalışma sürem 50-55 saati buluyordu. Sözleşmemde belirtilen 45 saatin üzerindeki çalışmalar için yasal fazla mesai ücreti talep ettiğimde, bu çalışmaların "vardiya düzenlemesi" kapsamında değerlendirildiği ve ayrıca ödeme yapılmayacağı söylendi.

Çalışma saatlerimi belgeleyen kendi kayıtlarımı tutmaya başladım. İnsan kaynakları birimine ilettiğimde konuyu "kurumsal politika" olarak aktardılar.`,
    relatedEntity: "Yetiş+ Çarşı",
    entitySlug: "yetis-carsi",
    employmentStart: "2022-09",
    employmentEnd: "2023-05",
    publishedAt: "2024-01-20",
    role: "Lojistik Koordinatörü",
    city: "İzmir",
  },
  {
    id: "exp-005",
    slug: "is-guvencesi-belirsizligi",
    title: "Sözleşme Yenilemesinde Yaşanan Belirsizlik",
    summary:
      "Belirli süreli iş sözleşmem defalarca yenilendi. Yenileme tarihleri konusunda son ana kadar bilgilendirilmedim.",
    content: `Hızır Global A.Ş. bünyesinde proje bazlı çalışan olarak 3 ay aralıklarla sözleşmem yenilendi. Her yenileme döneminde pozisyonumun devam edip etmeyeceğini yeni dönem başlayana kadar öğrenemiyordum.

Bu belirsizlik iş planlaması yapmamı son derece güçleştirdi. Üst yönetim "performans değerlendirme süreci devam ediyor" yanıtını verirken, İK birimi "onay bekleniyor" açıklamasıyla yetindi.

İş güvencesi olmayan bu sürekli belirsizlik ortamının psikolojik yükü oldukça ağır oldu.`,
    relatedEntity: "Hızır Global A.Ş.",
    entitySlug: "hazir-global",
    employmentStart: "2023-01",
    employmentEnd: "2023-10",
    publishedAt: "2024-02-28",
    role: "Proje Asistanı",
    city: "İstanbul",
  },
  {
    id: "exp-006",
    slug: "kidem-tazminati-anlasmazligi",
    title: "Kıdem Tazminatı Hesabında Anlaşmazlık",
    summary:
      "İş akdimin işveren tarafından sonlandırılmasının ardından hesaplanan kıdem tazminatının eksik olduğunu tespit ettim.",
    content: `Yetiş+ Çarşı'da 3 yılı aşkın süre çalıştıktan sonra iş akdim işveren tarafından sonlandırıldı. Hesaplanan kıdem tazminatı, son brüt ücretim üzerinden değil, önceki bir döneme ait daha düşük bir rakam üzerinden hesaplanmıştı.

İK departmanına itirazımı ilettim ve doğru hesaplamanın yapılmasını talep ettim. Görevli, "sisteme yansıyan ücret bu" yanıtıyla yetindi. Bordro kayıtlarımla karşılaştırdığımda aradaki farkın yaklaşık 8.000 TL olduğunu hesapladım.

Konuyu İş Mahkemesi'ne taşımak için hukuki danışmanlık sürecindeyim.`,
    relatedEntity: "Yetiş+ Çarşı",
    entitySlug: "yetis-carsi",
    employmentStart: "2020-06",
    employmentEnd: "2023-08",
    publishedAt: "2024-03-18",
    role: "Kıdemli Saha Yöneticisi",
    city: "Bursa",
  },
];

export function getAllExperiences(): Experience[] {
  return mockExperiences;
}

export function getExperienceBySlug(slug: string): Experience | undefined {
  return mockExperiences.find((e) => e.slug === slug);
}

export function getExperiencesByEntity(entitySlug: string): Experience[] {
  return mockExperiences.filter((e) => e.entitySlug === entitySlug);
}

export function searchExperiences(query: string): Experience[] {
  const q = query.toLowerCase().trim();
  if (!q) return mockExperiences;
  return mockExperiences.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.summary.toLowerCase().includes(q) ||
      e.relatedEntity.toLowerCase().includes(q) ||
      (e.role && e.role.toLowerCase().includes(q)) ||
      (e.city && e.city.toLowerCase().includes(q))
  );
}
