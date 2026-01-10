import { createElement } from '../../utils/create-element';

import './footer.css';

export function createFooter(): void {
  const footer = createElement({ tag: 'footer', className: 'footer' });

  const github = createElement({ tag: 'div', className: 'footer__github' });

  const year = createElement({
    tag: 'span',
    className: 'footer__year',
    textContent: `© ${new Date().getFullYear()}`,
  });

  const image = createElement({
    tag: 'div',
    className: 'footer__image',
  });

  const githubLink = createElement({
    tag: 'a',
    className: 'footer__link',
    textContent: 'rika-milew',
    attributes: {
      href: 'https://github.com/rika-milew',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  });

  github.append(image, githubLink);
  footer.append(github, year);
  document.body.append(footer);
}
