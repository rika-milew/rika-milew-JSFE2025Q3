import { createElement } from '@/utils/create-element';

import './footer.css';

export function createFooter(): HTMLElement {
  const footer = createElement({ tag: 'footer', className: ['footer'] });

  const school = createElement({ tag: 'div', className: ['footer__school'] });

  const logo = createElement({
    tag: 'img',
    className: ['footer__logo'],
    attributes: {
      src: 'icons/rs.svg',
      alt: 'RS School',
    },
  });

  const schoolName = createElement({
    tag: 'p',
    textContent: 'RS School',
  });

  const github = createElement({ tag: 'div', className: ['footer__github'] });

  const year = createElement({
    tag: 'span',
    className: ['footer__year'],
    textContent: `© ${new Date().getFullYear()}`,
  });

  const image = createElement({
    tag: 'div',
    className: ['footer__image'],
  });

  const githubLink = createElement({
    tag: 'a',
    className: ['footer__link'],
    textContent: 'rika-milew',
    attributes: {
      href: 'https://github.com/rika-milew',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  });

  school.append(logo, schoolName);
  github.append(image, githubLink);
  footer.append(school, github, year);

  return footer;
}
