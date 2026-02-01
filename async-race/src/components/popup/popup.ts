import { createElement } from '@/utils/create-element';

import type { PopupOptions } from '@/types/types';

export function createPopup(options: PopupOptions): { show: (message: string) => void } {
  const {
    overlayClass,
    containerClass,
    headingContent,
    imageSrc,
    animationDuration,
    messageContent,
  } = options;

  const overlay: HTMLDivElement = createElement({ tag: 'div', className: [overlayClass] });
  const container: HTMLDivElement = createElement({ tag: 'div', className: [containerClass] });
  const heading: HTMLHeadingElement = createElement({ tag: 'h2', textContent: headingContent });
  const content: HTMLParagraphElement = createElement({ tag: 'p' });

  const image: HTMLImageElement = createElement({
    tag: 'img',
    attributes: { src: imageSrc, width: '100', height: '100' },
  });

  container.append(heading, content, image);
  overlay.append(container);
  document.body.append(overlay);

  let timeout: ReturnType<typeof setTimeout> | undefined;

  function show(message: string): void {
    if (!document.body.contains(overlay)) {
      document.body.append(overlay);
    }

    if (timeout) {
      clearTimeout(timeout);
    }

    content.textContent = messageContent ? messageContent(message) : message;

    const scrollTop: number = window.scrollY || window.pageYOffset;
    const viewportHeight: number = window.innerHeight;
    container.style.top = `${scrollTop + viewportHeight / 2}px`;

    requestAnimationFrame(() => {
      overlay.classList.add('visible');
    });

    timeout = setTimeout(() => {
      overlay.classList.remove('visible');
      content.textContent = '';
      timeout = undefined;
    }, animationDuration);
  }

  return { show };
}
