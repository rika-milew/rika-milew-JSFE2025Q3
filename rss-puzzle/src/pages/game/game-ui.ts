import { createButton } from '../../components/button/button';
import { createHeading } from '../../components/heading/heading';
import { createSentence } from '../../components/sentence/sentence';
import { createElement } from '../../utils/create-element';

export type GameUI = {
  roundTitle: HTMLElement;
  source: HTMLElement;
  result: HTMLElement;
  userSentence: HTMLElement;
  placeholder: HTMLElement;
  checkButton: HTMLButtonElement;
  autoCompleteButton: HTMLButtonElement;
};

export function createGameUI(round: string): GameUI {
  const roundTitle = createHeading('gamePage', round);

  const source = createElement({
    tag: 'div',
    className: 'source',
  });

  const result = createElement({
    tag: 'div',
    className: 'result',
  });

  const userSentence = createSentence(result);

  const placeholder = createElement({
    tag: 'p',
    className: 'result__placeholder',
    textContent: 'Build the sentence here',
  });

  const checkButton = createButton({
    text: 'Check',
    disabled: true,
  });

  const autoCompleteButton = createButton({
    text: "I don't know",
  });

  return {
    roundTitle,
    source,
    result,
    userSentence,
    placeholder,
    checkButton,
    autoCompleteButton,
  };
}
