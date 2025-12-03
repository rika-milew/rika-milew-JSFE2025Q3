import type { NewsApiResponse, SourcesApiResponse } from 'types';
export declare class AppView {
    private readonly news;
    private readonly sources;
    constructor();
    drawNews(data: NewsApiResponse | null | undefined): void;
    drawSources(data: SourcesApiResponse | null | undefined): void;
}
export default AppView;
//# sourceMappingURL=appView.d.ts.map