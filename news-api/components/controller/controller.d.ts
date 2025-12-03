import AppLoader from './appLoader';
import type { NewsApiResponse, SourcesApiResponse } from 'types';
declare class AppController extends AppLoader {
    getSources(callback: (data: SourcesApiResponse | null | undefined) => void): void;
    getNews(e: Event, callback: (data: NewsApiResponse | null | undefined) => void): void;
}
export default AppController;
//# sourceMappingURL=controller.d.ts.map