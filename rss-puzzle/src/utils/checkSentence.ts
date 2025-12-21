export function checkSentence(resultContainer: HTMLElement, correctSentence: string[]): boolean {
  const playerSentence = [...resultContainer.querySelectorAll('.word')].map(
    (card) => card.textContent || '',
  );

  return (
    playerSentence.length === correctSentence.length &&
    playerSentence.every((word, index) => word === correctSentence[index])
  );
}
