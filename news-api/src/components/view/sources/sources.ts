import type { NewsSource } from 'types';
import './sources.css';

class Sources {
  draw(data: NewsSource[]): void {
    const fragment = document.createDocumentFragment();
    const sourceItemTemp = document.querySelector('#sourceItemTemp');

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

    const sourcesContainer = document.querySelector('.sources');

    if (sourcesContainer instanceof HTMLElement) {
      sourcesContainer.append(fragment);
    }
  }
}

export default Sources;
