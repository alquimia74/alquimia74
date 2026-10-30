export type AdminStatus = "pending" | "reviewing" | "published" | "rejected";

export interface AdminApplication {
  id: string;
  title: string;
  relatedEntity: string;
  submittedAt: string;
  status: AdminStatus;
  displayName: string;
  summary: string;
  hasDocuments: boolean;
  reviewNote?: string;
}

/** ÖNEMLİ: Tamamen demo/temsili veridir. Gerçek başvuru değildir. */
export const mockAdminApplications: AdminApplication[] = [
  {
    id: "adm-001",
    title: "Ücret Ödemelerinde Gecikme Yaşanan Dönem",
    relatedEntity: "Yetiş+ Çarşı",
    submittedAt: "2024-10-15T09:23:00Z",
    status: "pending",
    displayName: "Anonim",
    summary: "Maaş ödemelerinin son aylarda düzenli olarak geciktiğine dair deneyim anlatımı.",
    hasDocuments: false,
  },
  {
    id: "adm-002",
    title: "SGK Kaydında Farklılığa İlişkin Anlatım",
    relatedEntity: "Hızır Global A.Ş.",
    submittedAt: "2024-10-10T14:00:00Z",
    status: "reviewing",
    displayName: "Takma Ad: Denizci",
    summary: "İşe giriş tarihi ile SGK kaydı arasındaki farklılığa dair anlatım.",
    hasDocuments: true,
    reviewNote: "Belge incelemesi devam ediyor.",
  },
  {
    id: "adm-003",
    title: "İşten Çıkış Sonrası Ücret Alacağı",
    relatedEntity: "Yetiş+ Çarşı",
    submittedAt: "2024-10-08T11:45:00Z",
    status: "published",
    displayName: "Anonim",
    summary: "İş akdinin sona ermesinin ardından son ay ücreti ve kıdem haklarının gecikmesi.",
    hasDocuments: false,
  },
  {
    id: "adm-004",
    title: "Çalışma Saatlerine İlişkin Deneyim",
    relatedEntity: "Yetiş+ Yemek",
    submittedAt: "2024-10-05T16:30:00Z",
    status: "rejected",
    displayName: "Anonim",
    summary: "Yayın ilkelerimize uymayan içerik nedeniyle reddedildi.",
    hasDocuments: false,
    reviewNote: "Anlatım birinci elden deneyim yerine üçüncü şahıs bilgisi içermektedir.",
  },
];
