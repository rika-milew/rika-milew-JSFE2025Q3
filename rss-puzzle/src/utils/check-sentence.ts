export function checkSentence(userSentence: HTMLElement, correctSentence: number[]): boolean {
  const playerSentence = [...userSentence.querySelectorAll<HTMLElement>('.word-wrapper')].map(
    (card) => Number(card.dataset.wordIndex),
  );

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
  const words = [...userSentence.querySelectorAll<HTMLElement>('.word-wrapper')];
  userSentence.style.pointerEvents = 'none';

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
  const words = [...result.querySelectorAll<HTMLElement>('.word-wrapper')];
  result.style.pointerEvents = 'none';

  words.forEach((word) => {
    word.classList.remove('correct', 'wrong');
    word.classList.add('correct', 'correct-animation', 'background');
    setTimeout(() => {
      word.classList.remove('correct-animation');
    }, ANIMATION_DURATION);
  });
}
