import { createModal } from '../../components/modal/modal';
import { createElement } from '../../utils/create-element';

export function showLogoutModal(container: HTMLElement, confirmLogout: () => void): void {
  const content = createElement({
    tag: 'p',
    className: 'modal__content',
    textContent: 'Are you sure you want to log out?',
  });

  createModal({
    container,
    content,
    buttons: [
      {
        text: 'Yes',
        className: 'modal__buttons_ok',
        onClick: confirmLogout,
      },
      {
        text: 'No',
        className: 'modal__buttons_cancel',
      },
    ],
  });
}
