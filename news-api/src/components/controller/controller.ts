import AppLoader from './appLoader';
import type { NewsApiResponse, SourcesApiResponse } from 'types';

class AppController extends AppLoader {
  getSources(callback: (data: SourcesApiResponse | null | undefined) => void): void {
    super.getResp({ endpoint: 'sources', options: {} }, callback);
  }

  getNews(e: Event, callback: (data: NewsApiResponse | null | undefined) => void): void {
    let target: EventTarget | null = e.target;
    if (!(target instanceof HTMLElement)) return;

    const newsContainer = e.currentTarget;
    if (!(newsContainer instanceof HTMLElement)) return;

    while (target && target !== newsContainer) {
      if (target instanceof HTMLElement && target.classList.contains('source__item')) {
        const sourceId = target.getAttribute('data-source-id');
        if (sourceId && newsContainer.getAttribute('data-source') !== sourceId) {
          newsContainer.setAttribute('data-source', sourceId);
          super.getResp(
            {
              endpoint: 'everything',
              options: {
                sources: sourceId,
              },
            },
            callback
          );
        }
        return;
      }

      if (target instanceof HTMLElement) {
        target = target.parentElement;
      } else {
        return;
      }
    }
  }
}

export default AppController;
