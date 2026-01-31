import { createFooter } from '@/components/footer/footer';
import { createHeader } from '@/components/header/header';
import { AboutPageText } from '@/configs/about-page-text';
import { createElement } from '@/utils/create-element';

import './about-page.css';

export function renderAboutPage(container: HTMLElement): void {
  container.replaceChildren();

  const wrapper = createElement({
    tag: 'div',
    className: ['wrapper'],
  });

  const header = createHeader('about');

  const pageContainer = createElement({
    tag: 'main',
    className: ['container', 'main'],
  });

  const about = createElement({
    tag: 'div',
    className: ['container about'],
  });

  const title = createElement({
    tag: 'h1',
    textContent: 'About Fun Chat',
    className: ['page-title'],
  });

  const introduction = createElement({
    tag: 'p',
    className: ['about__text'],
    textContent: AboutPageText.introduction,
  });

  const image = createElement({
    tag: 'img',
    className: ['about__image'],
    attributes: {
      src: 'icons/chat.png',
      alt: 'Fun Chat',
    },
  });

  const description = createElement({
    tag: 'p',
    className: ['about__text'],
    textContent: AboutPageText.description,
  });

  const featuresTitle = createElement({
    tag: 'h2',
    className: ['about__subtitle'],
    textContent: AboutPageText.featuresTitle,
  });

  const featuresList = createList(AboutPageText.features, 'about__list');

  const conclusion = createElement({
    tag: 'p',
    className: ['about__text'],
    textContent: AboutPageText.conclusion,
  });

  const footer = createFooter();

  about.append(title, introduction, image, description, featuresTitle, featuresList, conclusion);

  pageContainer.append(about);
  wrapper.append(header, pageContainer, footer);
  container.append(wrapper);
}

function createList(items: string[], className: string): HTMLUListElement {
  const ul = createElement({ tag: 'ul', className: [className] });
  items.forEach((text) => {
    ul.append(createElement({ tag: 'li', className: [`${className}-item`], textContent: text }));
  });
  return ul;
}
