import { createElement } from '../../utils/create-element';

import type { ButtonConfig } from '../../types/types';

import './button.css';

export function createButton(config: ButtonConfig): HTMLButtonElement {
  const { text, className = '', disabled = false, type = 'button' } = config;

  const defaultClasses = ['button'];
  const allClasses = className
    ? [...defaultClasses, className].join(' ')
    : defaultClasses.join(' ');

  return createElement({
    tag: 'button',
    className: [allClasses],
    textContent: text,
    attributes: {
      type,
      ...(disabled && { disabled: 'true' }),
    },
  });
}
