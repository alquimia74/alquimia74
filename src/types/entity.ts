export interface Entity {
  id: string;
  category: string;
  website?: string | null;
  sourceKind: "official" | "photo";
  sourceUrl?: string;
  comingSoon?: boolean;
  slug: string;
  name: string;
  alternativeNames: string[];
  neutralDescription: string;
  seoTitle: string;
  seoDescription: string;
  hasContent: boolean;
}
