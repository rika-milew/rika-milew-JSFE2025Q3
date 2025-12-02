import News from './news/news';
import Sources from './sources/sources';
import type { News as NewsApiResponse, ArticleTemplate, SourcesApiResponse, NewsSource } from 'types';

export class AppView {
  private readonly news: News;
  private readonly sources: Sources;

  constructor() {
    this.news = new News();
    this.sources = new Sources();
  }

  drawNews(data: NewsApiResponse | null | undefined): void {
    const values: ArticleTemplate[] = Array.isArray(data?.articles) ? data.articles : [];
    this.news.draw(values);
  }

  drawSources(data: SourcesApiResponse | null | undefined): void {
    const values: NewsSource[] = Array.isArray(data?.sources) ? data.sources : [];
    this.sources.draw(values);
  }
}

export default AppView;
