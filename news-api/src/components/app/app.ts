import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import type { News, SourcesApiResponse } from 'types';

class App {
  private readonly controller: AppController;
  private readonly view: AppView;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  start(): void {
    const sourcesContainer = document.querySelector('.sources');

    if (sourcesContainer instanceof HTMLElement) {
      sourcesContainer.addEventListener('click', (e: MouseEvent) => {
        this.controller.getNews(e, (data: News | null | undefined) => this.view.drawNews(data));
      });
    }
    this.controller.getSources((data: SourcesApiResponse | null | undefined) => this.view.drawSources(data));
  }
}

export default App;
