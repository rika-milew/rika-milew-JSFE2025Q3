import { createElement } from '../../../utils/create-element';
import { eventState } from '../state/event-state';

export function createResultsSection(heading: string, type: 'known' | 'unknown'): HTMLDivElement {
  const section = createElement({
    tag: 'div',
    className: `results__section results__section_${type}`,
  });

  const title = createElement({
    tag: 'h3',
    className: 'results__section-title',
    textContent: heading,
  });

  section.append(title);
  return section;
}

export function createResultsSentence(text: string, audioSource: string): HTMLDivElement {
  const item = createElement({
    tag: 'div',
    className: 'results__sentence',
  });

  const sentence = createElement({
    tag: 'span',
    textContent: text,
  });

  const audioIconContainer = createElement({
    tag: 'div',
    className: 'results__audio',
  });

  const audioIcon = createElement({
    tag: 'img',
    className: 'results__audio-icon',
    attributes: {
      src: '/icons/audio-play.svg',
      alt: 'Play audio',
    },
  });

  audioIcon.addEventListener('click', () => {
    eventState.emit('results:audio', audioSource);
  });

  audioIconContainer.append(audioIcon);
  item.append(sentence, audioIconContainer);
  return item;
}
