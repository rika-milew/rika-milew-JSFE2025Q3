export function checkSentence(resultContainer: HTMLElement, correctSentence: string[]): boolean {
  const playerSentence = [...resultContainer.querySelectorAll('.word')].map(
    (card) => card.textContent || '',
  );

  return (
    playerSentence.length === correctSentence.length &&
    playerSentence.every((word, index) => word === correctSentence[index])
  );
}

export function highlightSentence(resultContainer: HTMLElement, correctSentence: string[]): void {
  const ANIMATION_DURATION = 1000;
  const wordCards = [...resultContainer.querySelectorAll<HTMLElement>('.word')];
  resultContainer.style.pointerEvents = 'none';

  wordCards.forEach((wordCard, index) => {
    const isCorrect = wordCard.textContent === correctSentence[index];

    wordCard.classList.remove('correct', 'wrong');
    wordCard.classList.add(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      wordCard.classList.remove('correct', 'wrong');
      resultContainer.style.pointerEvents = 'auto';
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
