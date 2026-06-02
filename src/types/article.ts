export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  source: string;
  league: string;
  publishedAt: string;
  sourceUrl: string | null;
  isManual: boolean;
  isHidden: boolean;
}
