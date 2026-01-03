import { gameState } from '../pages/game/game-state';

export function setPuzzleBackground({
  wrapper,
  index,
  correctSentence,
}: {
  wrapper: HTMLElement;
  index: number;
  correctSentence: string[];
}): void {
  const word = [...wrapper.children].find(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element.classList.contains('word'),
  );

  const edge = [...wrapper.children].find(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element.classList.contains('word-wrapper__edge'),
  );

  const picture = new Image();
  picture.src = `/pictures/${gameState.levelImage}`;

  picture.addEventListener('load', () => {
    const WIDTH = 720;
    const scale = WIDTH / picture.width;
    const height = picture.height * scale;

    const ROWS = 10;
    const rowHeight = height / ROWS;
    const sentenceIndex = gameState.sentenceIndex;

    wrapper.style.height = `${rowHeight}px`;

    if (word) {
      word.style.height = '100%';
    }

    const chars = correctSentence.join('').length;

    const horizontalOffset = Math.round(
      (correctSentence.slice(0, index).join('').length / chars) * WIDTH,
    );
    const verticalOffset = Math.round(sentenceIndex * rowHeight);

    if (word) {
      word.style.setProperty('--background-image', `url(/pictures/${gameState.levelImage})`);
      word.style.setProperty('--background-size', `${WIDTH}px ${height}px`);
      word.style.setProperty(
        '--background-position',
        `-${horizontalOffset}px -${verticalOffset}px`,
      );
    }

    if (edge && word) {
      const wordRect = word.getBoundingClientRect();
      const edgeRect = edge.getBoundingClientRect();

      const EDGE_OVERLAP = 16;

      const edgeOffsetX = horizontalOffset + wordRect.width - edgeRect.width + EDGE_OVERLAP;
      const edgeOffsetY = verticalOffset + (wordRect.height - edgeRect.height) / 2;

      edge.style.setProperty('--background-image', `url(/pictures/${gameState.levelImage})`);
      edge.style.setProperty('--background-size', `${WIDTH}px ${height}px`);
      edge.style.setProperty('--background-position', `-${edgeOffsetX}px -${edgeOffsetY}px`);
    }
  });
}
