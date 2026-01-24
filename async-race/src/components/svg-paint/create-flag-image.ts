import { createElement } from '@/utils/create-element';

export function createFlagImage(): HTMLImageElement {
  return createElement({
    tag: 'img',
    className: ['race__finish'],
    attributes: {
      src: 'icons/finish.svg',
      alt: 'Finish',
    },
  });
}
