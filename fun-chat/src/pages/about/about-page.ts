import { AboutPageText } from '@/configs/about-page-text';
import { createElement } from '@/utils/create-element';

import './about-page.css';

export function renderAboutPage(container: HTMLElement): void {
  const pageContainer = createElement({
    tag: 'div',
    className: ['container'],
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

  const featuresList = createElement({
    tag: 'ul',
    className: ['about__list'],
  });

  AboutPageText.features.forEach((feature) => {
    const item = createElement({
      tag: 'li',
      className: ['about__list-item'],
      textContent: feature,
    });

    featuresList.append(item);
  });

  const conclusion = createElement({
    tag: 'p',
    className: ['about__text'],
    textContent: AboutPageText.conclusion,
  });

  container.replaceChildren();

  about.append(title, introduction, image, description, featuresTitle, featuresList, conclusion);

  pageContainer.append(about);
  container.append(pageContainer);
}
