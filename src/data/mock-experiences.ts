import { type Experience } from "@/types/experience";

export const mockExperiences: Experience[] = [
  {
    isExample: true,
    id: "exp-001",
    slug: "ucret-odemelerinde-gecikme-yasanan-donem",
    title: "Ücret ödemesi hakkında şikâyet hazırlama örneği",
    summary:
      "Çalışma dönemi, ödeme tarihi ve ilgili belgelerin bir başvuruda nasıl düzenlenebileceğini gösteren örnek kayıt.",
    content: `Şikâyetini hazırlarken yaşadığın olayı kendi sözlerinle, tarih sırasına göre anlat. Varsa ödeme tarihi, tutar veya ilgili kayıt bilgilerini ekle.

Anlatımını destekleyen belgeleri şikâyet başlığını belirterek e-postayla gönder. Kişisel bilgilerini metnin içinde paylaşma.`,
    relatedEntity: "Yetiş+ Çarşı",
    entitySlug: "yetis-carsi",
    period: "Nisan–Aralık 2023",
    publishedAt: "2024-02-15",
    staffType: "affiliate",
    city: "İstanbul",
  },
  {
    isExample: true,
    id: "exp-002",
    slug: "sgk-kaydinda-farklilika-iliskin-anlatim",
    title: "Sigorta kaydı hakkında şikâyet hazırlama örneği",
    summary:
      "Çalışma başlangıcı ile kayıt belgelerinin bir başvuruda nasıl karşılaştırılabileceğini gösteren örnek kayıt.",
    content: `Şikâyetini hazırlarken yaşadığın olayı kendi sözlerinle, tarih sırasına göre anlat. Varsa ödeme tarihi, tutar veya ilgili kayıt bilgilerini ekle.

Anlatımını destekleyen belgeleri şikâyet başlığını belirterek e-postayla gönder. Kişisel bilgilerini metnin içinde paylaşma.`,
    relatedEntity: "Yetiş+ Çarşı",
    entitySlug: "yetis-carsi",
    period: "Ağustos 2023–Ocak 2024",
    publishedAt: "2024-03-02",
    staffType: "headquarters",
    city: "İstanbul",
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
  const q = query.toLocaleLowerCase("tr-TR").trim();
  if (!q) return mockExperiences;
  return mockExperiences.filter(
    (e) =>
      e.title.toLocaleLowerCase("tr-TR").includes(q) ||
      e.summary.toLocaleLowerCase("tr-TR").includes(q) ||
      e.relatedEntity.toLocaleLowerCase("tr-TR").includes(q) ||
      (e.city && e.city.toLocaleLowerCase("tr-TR").includes(q)),
  );
}
