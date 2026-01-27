import { createButton } from '@/components/button/button';
import { createElement } from '@/utils/create-element';

export function renderAuthPage(container: HTMLElement): void {
  const pageContainer = createElement({
    tag: 'div',
    className: ['container'],
  });

  const title = createElement({
    tag: 'h1',
    textContent: 'Login Page',
    className: ['page-title'],
  });

  const button = createButton({
    text: 'Login',
    className: 'login-button',
    disabled: false,
  });

  container.replaceChildren();
  pageContainer.append(title, button);
  container.append(pageContainer);
}
