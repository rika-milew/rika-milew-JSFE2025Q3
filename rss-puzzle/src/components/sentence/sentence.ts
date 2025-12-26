import { createElement } from '../../utils/create-element';

import './sentence.css';

export function createSentence(resultContainer: HTMLElement): HTMLElement {
  const sentence = createElement({
    tag: 'div',
    className: 'sentence sentence_active',
  });

  resultContainer.append(sentence);
  return sentence;
}
