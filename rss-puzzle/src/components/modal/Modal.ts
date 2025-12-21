import { createElement } from '../../utils/createElement';

import './Modal.css';

export function showLogoutModal(root: HTMLElement, confirmLogout: () => void): void {
  const modalOverlay = createElement({
    tag: 'div',
    className: 'modal__overlay',
  });

  const modalWindow = createElement({
    tag: 'div',
    className: 'modal',
  });

  const modalContent = createElement({
    tag: 'p',
    className: 'modal__content',
    textContent: 'Are you sure you want to log out?',
  });

  const modalButtons = createElement({
    tag: 'div',
    className: 'modal__buttons',
  });

  const okButton = createElement({
    tag: 'button',
    className: 'modal__buttons_ok button',
    textContent: 'Yes',
    attributes: { type: 'button' },
  });

  const cancelButton = createElement({
    tag: 'button',
    className: 'modal__buttons_cancel button',
    textContent: 'No',
    attributes: { type: 'button' },
  });

  okButton.addEventListener('click', () => {
    modalOverlay.remove();
    confirmLogout();
  });

  cancelButton.addEventListener('click', () => {
    modalOverlay.remove();
  });

  modalButtons.append(okButton, cancelButton);
  modalWindow.append(modalContent, modalButtons);
  modalOverlay.append(modalWindow);
  root.append(modalOverlay);
}
