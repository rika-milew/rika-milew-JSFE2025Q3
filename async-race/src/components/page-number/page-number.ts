import { createElement } from '@/utils/create-element';

import type { PageInfoElements, PageInfoResults } from '@/types/types';

export function createPageNumber({
  title,
  page,
  total,
  totalText,
}: PageInfoElements): PageInfoResults {
  const container: HTMLDivElement = createElement({ tag: 'div', className: ['page-info'] });
  const content: HTMLDivElement = createElement({ tag: 'div', className: ['content'] });
  const heading: HTMLHeadingElement = createElement({ tag: 'h2', textContent: title });
  const pageInfo: HTMLParagraphElement = createElement({
    tag: 'p',
    className: ['info'],
    textContent: `Page: ${page}`,
  });

  const totalInfo: HTMLParagraphElement = createElement({
    tag: 'p',
    className: ['info'],
    textContent: `${totalText}: ${total}`,
  });

  content.append(heading, pageInfo, totalInfo);
  container.append(heading, content);

  return { container, totalInfo, pageInfo };
}
