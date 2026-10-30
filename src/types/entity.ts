export interface Entity {
  id: string;
  slug: string;
  name: string;
  alternativeNames: string[];
  neutralDescription: string;
  seoTitle: string;
  seoDescription: string;
  hasContent: boolean;
}
