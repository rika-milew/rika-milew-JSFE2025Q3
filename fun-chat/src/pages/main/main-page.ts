import { createButton } from '@/components/button/button';
import { handleLogout } from '@/pages/main/helpers/handle-logout';
import { createElement } from '@/utils/create-element';

export function renderMainPage(container: HTMLElement): void {
  const pageContainer = createElement({
    tag: 'div',
    className: ['container'],
  });

  const title = createElement({
    tag: 'h1',
    textContent: 'Main Page',
    className: ['page-title'],
  });

  const button = createButton({
    text: 'Logout',
    className: 'logout-button',
    disabled: false,
  });

  button.addEventListener('click', () => {
    handleLogout();
  });

  container.replaceChildren();
  pageContainer.append(title, button);
  container.append(pageContainer);
}
