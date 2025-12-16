import type { HTMLElements, ElementTag, ElementOptions } from '../types/types';

export const createElement = <K extends ElementTag>({
  tag,
  className,
  textContent,
  attributes,
}: ElementOptions<K>): HTMLElements[K] => {
  const element = document.createElement(tag);
  if (className) {
    element.className = Array.isArray(className) ? className.join(' ') : className;
  }
  if (textContent) {
    element.textContent = textContent;
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  return element;
};
