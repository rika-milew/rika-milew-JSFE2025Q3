export type SourceTemplate = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
};

export type SourcesApiResponse = {
  status: string;
  sources: SourceTemplate[];
};

export type NewsApiResponse = {
  status: string;
  totalResults: number;
  articles?: ArticleTemplate[];
};

export type NewsSource = {
  id: string | null;
  name: string;
};

export type ArticleTemplate = {
  source: NewsSource;
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};

export type Article = {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};

export type GetResponse = {
  endpoint: string;
  options: Record<string, string | number | boolean>;
};
