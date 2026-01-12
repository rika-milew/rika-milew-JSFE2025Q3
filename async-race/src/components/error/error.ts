import { createElement } from '../../utils/create-element';

import './error.css';

export function createErrorPopup(): { show: (message: string) => void } {
  const overlay = createElement({ tag: 'div', className: 'error-overlay' });
  const container = createElement({ tag: 'div', className: 'error' });
  const heading = createElement({ tag: 'h2', textContent: 'Error' });
  const content = createElement({ tag: 'p' });

  const image = createElement({
    tag: 'img',
    attributes: {
      src: '/error-icon.svg',
      alt: 'Error icon',
      width: '100',
      height: '100',
    },
  });

  container.append(heading, content, image);
  overlay.append(container);
  document.body.append(overlay);

  let timeout: ReturnType<typeof setTimeout> | undefined;

  function show(message: string): void {
    const ANIMATION_DURATION = 2000;
    document.body.style.overflow = 'hidden';

    if (timeout) {
      clearTimeout(timeout);
    }

    content.textContent = message;
    overlay.classList.add('visible');

    timeout = setTimeout(() => {
      overlay.classList.remove('visible');
      content.textContent = '';
      timeout = undefined;
      document.body.style.overflow = '';
    }, ANIMATION_DURATION);
  }

  return { show };
}
