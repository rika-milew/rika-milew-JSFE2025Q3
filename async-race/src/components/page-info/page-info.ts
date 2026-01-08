import { createElement } from '../../utils/create-element';

import type { PageInfoElements } from '../../types/types';

export function createInfoElements({
  title,
  page,
  total,
  totalText,
}: PageInfoElements): HTMLElement {
  const container = createElement({ tag: 'div', className: 'container' });
  const content = createElement({ tag: 'div', className: 'content' });

  const heading = createElement({ tag: 'h2', textContent: title });
  const pageInfo = createElement({ tag: 'p', className: 'info', textContent: `Page: ${page}` });
  const totalInfo = createElement({
    tag: 'p',
    className: 'info',
    textContent: `${totalText}: ${total}`,
  });

  container.append(heading, content);
  content.append(pageInfo, totalInfo);

  return container;
}
