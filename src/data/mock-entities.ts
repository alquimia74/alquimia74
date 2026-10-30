import { type Entity } from "@/types/entity";

/**
 * ÖNEMLİ UYARI:
 * Bu sayfadaki kurum bilgileri kamuya açık kaynaklara dayanmaktadır.
 * Mülkiyet, iştirak veya yönetim ilişkileri resmî ticaret sicili veya güvenilir
 * kaynaklarla doğrulanmadan kesin gerçek olarak sunulmamaktadır.
 * "İlişkinin niteliği doğrulanmalıdır" notu eklenen alanlarda ihtiyatla yaklaşın.
 */
export const mockEntities: Entity[] = [
  {
    id: "ent-001",
    slug: "hazir-global",
    name: "Hızır Global A.Ş.",
    alternativeNames: ["Hızır Global", "Hazır Global"],
    neutralDescription:
      "Hızır Global A.Ş., Türkiye'de faaliyet gösterdiği belirtilen bir şirkettir. Çeşitli ticari markalar ve faaliyetlerle ilişkilendirildiği iddia edilmekte olup bu ilişkilerin niteliği resmî kaynaklarla doğrulanmalıdır.",
    seoTitle: "Hızır Global A.Ş. Çalışan Deneyimleri | YetişVar",
    seoDescription:
      "Hızır Global A.Ş. hakkında çalışanların ücret, SGK ve çalışma koşullarıyla ilgili deneyimlerini paylaşabildiği bağımsız platform.",
    hasContent: true,
  },
  {
    id: "ent-002",
    slug: "yetis-carsi",
    name: "Yetiş+ Çarşı",
    alternativeNames: ["Yetiş Çarşı", "Yetiscarsi", "Yetiş+Çarşı"],
    neutralDescription:
      "Yetiş+ Çarşı, Türkiye'de faaliyet gösteren bir ticari marka olarak bilinmektedir. Hızır Global A.Ş. ile ilişkisi olduğu belirtilmekte olup bu ilişkinin niteliği resmî kaynaklarla doğrulanmalıdır.",
    seoTitle: "Yetiş+ Çarşı Çalışan Deneyimleri | YetişVar",
    seoDescription:
      "Yetiş+ Çarşı hakkında çalışanların ücret, SGK ve çalışma koşullarıyla ilgili deneyimlerini paylaşabildiği bağımsız platform.",
    hasContent: true,
  },
  {
    id: "ent-003",
    slug: "yetis-yemek",
    name: "Yetiş+ Yemek",
    alternativeNames: ["Yetiş Yemek", "YetişYemek"],
    neutralDescription:
      "Yetiş+ Yemek, yemek hizmetleri alanında faaliyet gösteren bir marka olarak bilinmektedir. Hızır Global A.Ş. ile ilişkisi olduğu belirtilmekte olup bu ilişkinin niteliği doğrulanmalıdır.",
    seoTitle: "Yetiş+ Yemek Çalışan Deneyimleri | YetişVar",
    seoDescription:
      "Yetiş+ Yemek hakkında çalışan deneyimlerinin paylaşıldığı bağımsız platform.",
    hasContent: false,
  },
  {
    id: "ent-004",
    slug: "ib-bor",
    name: "İB-Bor",
    alternativeNames: ["IB Bor", "İBBor"],
    neutralDescription:
      "İB-Bor, Hızır Global A.Ş. veya ilgili faaliyetlerle bağlantılı olduğu belirtilen bir yapılanmadır. Bu ilişkinin niteliği bağımsız kaynaklarla doğrulanmalıdır.",
    seoTitle: "İB-Bor Çalışan Deneyimleri | YetişVar",
    seoDescription:
      "İB-Bor hakkında çalışan deneyimlerinin paylaşıldığı bağımsız platform.",
    hasContent: false,
  },
  {
    id: "ent-005",
    slug: "yeton",
    name: "YETON",
    alternativeNames: ["Yeton"],
    neutralDescription:
      "YETON, Hızır Global A.Ş. veya ilgili faaliyetlerle bağlantılı olduğu belirtilen bir yapılanmadır. Bu ilişkinin niteliği bağımsız kaynaklarla doğrulanmalıdır.",
    seoTitle: "YETON Çalışan Deneyimleri | YetişVar",
    seoDescription:
      "YETON hakkında çalışan deneyimlerinin paylaşıldığı bağımsız platform.",
    hasContent: false,
  },
  {
    id: "ent-006",
    slug: "tokx",
    name: "TOKX",
    alternativeNames: ["Tokx"],
    neutralDescription:
      "TOKX, Hızır Global A.Ş. veya ilgili faaliyetlerle bağlantılı olduğu belirtilen bir yapılanmadır. Bu ilişkinin niteliği bağımsız kaynaklarla doğrulanmalıdır.",
    seoTitle: "TOKX Çalışan Deneyimleri | YetişVar",
    seoDescription:
      "TOKX hakkında çalışan deneyimlerinin paylaşıldığı bağımsız platform.",
    hasContent: false,
  },
];

export function getAllEntities(): Entity[] {
  return mockEntities;
}

export function getEntityBySlug(slug: string): Entity | undefined {
  return mockEntities.find((e) => e.slug === slug);
}
