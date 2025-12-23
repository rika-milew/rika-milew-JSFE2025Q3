export function checkSentence(
  activeResultSentence: HTMLElement,
  correctSentence: string[],
): boolean {
  const playerSentence = [...activeResultSentence.querySelectorAll('.word')].map(
    (card) => card.textContent || '',
  );

  return (
    playerSentence.length === correctSentence.length &&
    playerSentence.every((word, index) => word === correctSentence[index])
  );
}

export function highlightSentence(
  activeResultSentence: HTMLElement,
  correctSentence: string[],
): void {
  const ANIMATION_DURATION = 1000;
  const wordCards = [...activeResultSentence.querySelectorAll<HTMLElement>('.word')];
  activeResultSentence.style.pointerEvents = 'none';

  wordCards.forEach((wordCard, index) => {
    const isCorrect = wordCard.textContent === correctSentence[index];

    wordCard.classList.remove('correct', 'wrong');
    wordCard.classList.add(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      wordCard.classList.remove('correct', 'wrong');
      activeResultSentence.style.pointerEvents = 'auto';
    }, ANIMATION_DURATION);
  });
}

export function highlightCorrectSentence(resultContainer: HTMLElement): void {
  const wordCards = [...resultContainer.querySelectorAll<HTMLElement>('.word')];
  resultContainer.style.pointerEvents = 'none';

  wordCards.forEach((wordCard) => {
    wordCard.classList.remove('correct', 'wrong');
    wordCard.classList.add('correct');
  });
}
