import { createFooter } from '@/components/footer/footer';
import { createHeader } from '@/components/header/header';
import { createElement } from '@/utils/create-element';

export function renderMainPage(container: HTMLElement): void {
  container.replaceChildren();

  const wrapper: HTMLDivElement = createElement({
    tag: 'div',
    className: ['wrapper'],
  });

  const header: HTMLElement = createHeader('main');

  const pageContainer: HTMLElement = createElement({
    tag: 'main',
    className: ['container main'],
  });

  const title: HTMLHeadingElement = createElement({
    tag: 'h1',
    textContent: 'Main Page',
    className: ['page-title'],
  });

  const footer: HTMLElement = createFooter();

  pageContainer.append(title);
  wrapper.append(header, pageContainer, footer);
  container.append(wrapper);
}
