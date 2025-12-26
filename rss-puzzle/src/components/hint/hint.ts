import { createElement } from '../../utils/create-element';

import type { HintConfig } from '../../configs/hint.config';

import './hint.css';

export function createHint(config: HintConfig): HTMLElement {
  const { container, text, icon, className, hover = true } = config;

  const wrapper = createElement({
    tag: 'div',
    className: className ?? 'hint__wrapper',
  });

  const hintText = createElement({
    tag: 'p',
    className: 'hint__text',
    textContent: text,
  });

  if (hover) {
    hintText.classList.add('hint__hover');
  }

  const hintIcon = createElement({
    tag: 'img',
    className: 'hint__icon',
    attributes: icon ? { src: icon, alt: 'hint icon' } : undefined,
  });

  wrapper.append(hintText, hintIcon);

  container.append(wrapper);

  const set = (newText: string): void => {
    hintText.textContent = newText;
  };

  Object.defineProperty(wrapper, 'setText', {
    value: set,
    writable: false,
    enumerable: false,
  });

  return wrapper;
}
