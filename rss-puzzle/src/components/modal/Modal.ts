import { createElement } from '../../utils/create-element';

import type { ModalElements } from '../../types/types';

import './modal.css';

export function createModal({ container, content, buttons }: ModalElements): void {
  const overlay = createElement({
    tag: 'div',
    className: 'modal__overlay',
  });

  const modal = createElement({
    tag: 'div',
    className: 'modal',
  });

  const modalButtons = createElement({
    tag: 'div',
    className: 'modal__buttons',
  });

  buttons.forEach(({ text, className, onClick }) => {
    const button = createElement({
      tag: 'button',
      className: `button ${className ?? ''}`,
      textContent: text,
      attributes: { type: 'button' },
    });

    button.addEventListener('click', () => {
      overlay.remove();
      onClick?.();
    });

    modalButtons.append(button);
  });

  modal.append(content, modalButtons);
  overlay.append(modal);
  container.append(overlay);
}
