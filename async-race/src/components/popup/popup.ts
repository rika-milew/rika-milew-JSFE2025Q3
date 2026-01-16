import { createElement } from '@utils/create-element';

import type { PopupOptions } from '@/types/types';

export function createPopup(options: PopupOptions): { show: (message: string) => void } {
  const {
    overlayClass,
    containerClass,
    headingContent,
    imageSrc,
    imageAlt,
    animationDuration,
    messageContent,
  } = options;

  const overlay = createElement({ tag: 'div', className: [overlayClass] });
  const container = createElement({ tag: 'div', className: [containerClass] });
  const heading = createElement({ tag: 'h2', textContent: headingContent });
  const content = createElement({ tag: 'p' });

  const image = createElement({
    tag: 'img',
    attributes: { src: imageSrc, alt: imageAlt, width: '100', height: '100' },
  });

  container.append(heading, content, image);
  overlay.append(container);
  document.body.append(overlay);

  let timeout: ReturnType<typeof setTimeout> | undefined;

  function show(message: string): void {
    if (!document.body.contains(overlay)) {
      document.body.append(overlay);
    }

    document.body.style.overflow = 'hidden';

    if (timeout) {
      clearTimeout(timeout);
    }

    content.textContent = messageContent ? messageContent(message) : message;

    const scrollTop = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    container.style.top = `${scrollTop + viewportHeight / 2}px`;

    requestAnimationFrame(() => {
      overlay.classList.add('visible');
    });

    timeout = setTimeout(() => {
      overlay.classList.remove('visible');
      content.textContent = '';
      timeout = undefined;
      document.body.style.overflow = '';
    }, animationDuration);
  }

  return { show };
}
