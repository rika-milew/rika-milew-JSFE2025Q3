import { createFooter } from '@/components/footer/footer';
import { createHeader } from '@/components/header/header';
import { createElement } from '@/utils/create-element';

export function renderMainPage(container: HTMLElement): void {
  container.replaceChildren();

  const wrapper = createElement({
    tag: 'div',
    className: ['wrapper'],
  });

  const header = createHeader('main');

  const pageContainer = createElement({
    tag: 'main',
    className: ['container main'],
  });

  const title = createElement({
    tag: 'h1',
    textContent: 'Main Page',
    className: ['page-title'],
  });

  const footer = createFooter();

  pageContainer.append(title);
  wrapper.append(header, pageContainer, footer);
  container.append(wrapper);
}
