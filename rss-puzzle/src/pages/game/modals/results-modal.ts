import { createModal } from '../../../components/modal/modal';
import { createElement } from '../../../utils/create-element';
import { eventState } from '../event-state';
import { displayMiniature } from './artwork-miniature';
import { gameState } from '../game-state';
import { createResultsSection, createResultsSentence } from './results-elements';
import { resultsState } from './results-state';

import './results-modal.css';

let currentResultsModal: HTMLElement | undefined;

export function openResultsModal(container: HTMLElement): void {
  if (currentResultsModal) {
    currentResultsModal.remove();
    currentResultsModal = undefined;
  }

  const results = resultsState.get();
  if (!results) {
    return;
  }

  const content = createElement({
    tag: 'div',
    className: 'results',
  });

  const title = createElement({
    tag: 'h2',
    className: 'results__title',
    textContent: 'Round Statistics',
  });

  content.append(title);

  if (gameState.cutImage) {
    const artworkMiniature = displayMiniature();
    content.append(artworkMiniature);
  }

  const knownSection = createResultsSection('I know', 'known');
  const unknownSection = createResultsSection("I don't know", 'unknown');

  results.sentences
    .filter((sentence) => sentence.isKnown)
    .forEach((sentence) => {
      knownSection.append(createResultsSentence(sentence.text, sentence.audioSource));
    });

  results.sentences
    .filter((sentence) => !sentence.isKnown)
    .forEach((sentence) => {
      unknownSection.append(createResultsSentence(sentence.text, sentence.audioSource));
    });

  content.append(knownSection, unknownSection);

  currentResultsModal = createModal({
    container,
    content,
    modalClassName: 'results-modal',
    buttons: [
      {
        text: 'Next Round',
        className: 'results__button',
        onClick: (): void => {
          eventState.emit('round:next', true);
        },
      },
    ],
  });
}
