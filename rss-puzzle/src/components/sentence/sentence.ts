import { createElement } from '../../utils/create-element';

import './sentence.css';

export function createResultSentence(resultContainer: HTMLElement): HTMLElement {
  const sentence = createElement({
    tag: 'div',
    className: 'result__sentence result__sentence_active',
  });

  resultContainer.append(sentence);
  return sentence;
}
