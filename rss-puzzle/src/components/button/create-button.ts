import { createElement } from '../../utils/create-element';

import type { Button } from '../../types/types';

export function createButton({ text, className, disabled = false }: Button): HTMLButtonElement {
  return createElement({
    tag: 'button',
    className,
    textContent: text,
    attributes: {
      type: 'button',
      ...(disabled && { disabled: 'true' }),
    },
  });
}
