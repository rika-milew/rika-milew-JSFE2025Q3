import { createButton } from '@/components/button/button';
import { createFooter } from '@/components/footer/footer';
import { handleLogout } from '@/pages/main/helpers/handle-logout';
import { createElement } from '@/utils/create-element';

export function renderMainPage(container: HTMLElement): void {
  container.replaceChildren();

  const wrapper = createElement({
    tag: 'div',
    className: ['wrapper'],
  });

  const pageContainer = createElement({
    tag: 'main',
    className: ['container main'],
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

  const footer = createFooter();

  pageContainer.append(title, button);
  wrapper.append(pageContainer, footer);
  container.append(wrapper);
}
