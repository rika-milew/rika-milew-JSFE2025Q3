import { createElement } from '@/utils/create-element';

import type { ButtonConfig } from '@/types/types';

import './button.css';

export function createButton(config: ButtonConfig): HTMLButtonElement {
  const text: string = config.text;
  const className: string = config.className ?? '';
  const disabled: boolean = config.disabled ?? false;
  const type: 'button' | 'submit' | 'reset' = config.type ?? 'button';

  const defaultClasses: string[] = ['button'];

  const allClasses: string = className
    ? [...defaultClasses, className].join(' ')
    : defaultClasses.join(' ');

  const button: HTMLButtonElement = createElement({
    tag: 'button',
    className: [allClasses],
    textContent: text,
    attributes: {
      type,
      ...(disabled && { disabled: 'true' }),
    },
  });

  return button;
}
