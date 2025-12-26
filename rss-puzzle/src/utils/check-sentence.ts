export function checkSentence(userSentence: HTMLElement, correctSentence: string[]): boolean {
  const playerSentence = [...userSentence.querySelectorAll('.word-wrapper')].map(
    (card) => card.textContent || '',
  );

  return (
    playerSentence.length === correctSentence.length &&
    playerSentence.every((word, index) => word === correctSentence[index])
  );
}

export function highlightSentence(userSentence: HTMLElement, correctSentence: string[]): void {
  const ANIMATION_DURATION = 1000;
  const words = [...userSentence.querySelectorAll<HTMLElement>('.word-wrapper')];
  userSentence.style.pointerEvents = 'none';

  words.forEach((word, index) => {
    const isCorrect = word.textContent === correctSentence[index];

    word.classList.remove('correct', 'wrong');
    word.classList.add(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      word.classList.remove('correct', 'wrong');
      userSentence.style.pointerEvents = 'auto';
    }, ANIMATION_DURATION);
  });
}

export function highlightCorrectSentence(result: HTMLElement): void {
  const words = [...result.querySelectorAll<HTMLElement>('.word-wrapper')];
  result.style.pointerEvents = 'none';

  words.forEach((word) => {
    word.classList.remove('correct', 'wrong');
    word.classList.add('correct');
  });
}
