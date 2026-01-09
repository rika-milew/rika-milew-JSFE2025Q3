import { createElement } from '../../utils/create-element';

import type { ModalElements } from '../../types/types';

import './modal1.css';

export function createModal({
  container,
  content,
  buttons,
  modalClassName,
}: ModalElements): HTMLElement {
  const overlay = createElement({
    tag: 'div',
    className: 'modal__overlay',
  });

  const modal = createElement({
    tag: 'div',
    className: `modal ${modalClassName ?? ''}`,
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

  return overlay;
}
