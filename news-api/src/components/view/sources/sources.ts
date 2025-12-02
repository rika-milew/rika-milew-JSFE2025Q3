import type { NewsSource } from 'types';
import './sources.css';

class Sources {
  private allSources: NewsSource[] = [];
  draw(data: NewsSource[]): void {
    this.allSources = data;

    const wrapper = document.querySelector('.sources.buttons');
    if (!(wrapper instanceof HTMLElement)) return;

    let searchContainer = wrapper.querySelector<HTMLDivElement>('.search-container');
    if (!searchContainer) {
      searchContainer = document.createElement('div');
      searchContainer.classList.add('search-container');

      const searchField = document.createElement('input');
      searchField.type = 'text';
      searchField.placeholder = 'Search...';
      searchField.classList.add('search');

      searchField.addEventListener('input', () => {
        this.filterSources(searchField.value);
      });

      searchContainer.append(searchField);
      wrapper.prepend(searchContainer);
    }

    let listContainer = wrapper.querySelector<HTMLDivElement>('.sources-list');
    if (!listContainer) {
      listContainer = document.createElement('div');
      listContainer.classList.add('sources-list');
      wrapper.append(listContainer);
    }

    this.createSources(this.allSources, listContainer);
  }

  private createSources(data: NewsSource[], container: HTMLElement): void {
    container.innerHTML = '';

    const fragment: DocumentFragment = document.createDocumentFragment();
    const sourceItemTemp: Element | null = document.querySelector('#sourceItemTemp');

    if (!(sourceItemTemp instanceof HTMLTemplateElement)) {
      return;
    }

    data.forEach((item) => {
      const sourceClone = sourceItemTemp.content.cloneNode(true);

      if (!(sourceClone instanceof DocumentFragment)) {
        return;
      }

      const sourceName = sourceClone.querySelector('.source__item-name');
      if (!(sourceName instanceof HTMLElement)) return;
      sourceName.textContent = item.name;

      const sourceItem = sourceClone.querySelector('.source__item');
      if (!(sourceItem instanceof HTMLElement)) return;
      sourceItem.setAttribute('data-source-id', String(item.id));

      fragment.append(sourceClone);
    });

    container.append(fragment);
  }

  private filterSources(query: string): void {
    const wrapper = document.querySelector('.sources.buttons');
    if (!(wrapper instanceof HTMLElement)) return;

    const listContainer = wrapper.querySelector<HTMLDivElement>('.sources-list');
    if (!listContainer) return;

    const filtered = this.allSources.filter((source) => source.name.toLowerCase().includes(query.toLowerCase()));
    this.createSources(filtered, listContainer);
  }
}

export default Sources;
