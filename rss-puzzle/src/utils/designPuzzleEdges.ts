export function designPuzzleEdges(
  wordWrapper: HTMLElement,
  wordCard: HTMLElement,
  word: string,
  correctSentence: string[],
): void {
  const index = correctSentence.indexOf(word);
  const lastIndex = correctSentence.length - 1;

  wordCard.classList.remove('word_mask');

  if (index !== 0) {
    wordCard.classList.add('word_mask');
  }

  if (index !== lastIndex) {
    const edge = document.createElement('div');
    edge.className = 'word-wrapper__edge';
    wordWrapper.append(edge);
  }
}
