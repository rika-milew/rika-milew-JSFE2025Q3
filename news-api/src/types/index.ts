export interface SourceTemplate {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
}

export interface Sources {
  status: string;
  sources: SourceTemplate[];
}

export interface News {
  status: string;
  totalResults: number;
  articles: ArticleTemplate[];
}

export interface NewsSource {
  id: string | null;
  name: string;
}

export interface ArticleTemplate {
  source: NewsSource;
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}