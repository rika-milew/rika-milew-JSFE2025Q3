import { playSound } from './play-sounds';

export function checkSentence(userSentence: HTMLElement, correctSentence: number[]): boolean {
  const playerSentence = [...userSentence.children]
    .filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && child.classList.contains('word-wrapper'),
    )
    .map((card) => Number(card.dataset.wordIndex));

  return (
    playerSentence.length === correctSentence.length &&
    playerSentence.every((id, index) => id === correctSentence[index])
  );
}

export function highlightSentence(
  autoCompleteButton: HTMLButtonElement,
  userSentence: HTMLElement,
  correctSentenceIndexes: number[],
): void {
  const ANIMATION_DURATION = 1000;

  const words = [...userSentence.children].filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.classList.contains('word-wrapper'),
  );

  userSentence.style.pointerEvents = 'none';

  playSound('lose');

  words.forEach((word, index) => {
    const wordIndex = Number(word.dataset.wordIndex);
    const isCorrect = wordIndex === correctSentenceIndexes[index];

    word.classList.remove('correct-animation', 'wrong');
    word.classList.add(isCorrect ? 'correct-animation' : 'wrong');

    setTimeout(() => {
      word.classList.remove('correct-animation', 'wrong');
      userSentence.style.pointerEvents = 'auto';
      autoCompleteButton.disabled = false;
    }, ANIMATION_DURATION);
  });
}

export function highlightCorrectSentence(result: HTMLElement): void {
  const ANIMATION_DURATION = 1000;

  const words = [...result.children].filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.classList.contains('word-wrapper'),
  );

  result.style.pointerEvents = 'none';

  playSound('correct');

  words.forEach((word) => {
    word.classList.remove('correct', 'wrong');
    word.classList.add('correct', 'correct-animation', 'background');
    setTimeout(() => {
      word.classList.remove('correct-animation');
    }, ANIMATION_DURATION);
  });
}
