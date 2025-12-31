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
  const word = wrapper.querySelector<HTMLElement>('.word');
  const edge = wrapper.querySelector<HTMLElement>('.word-wrapper__edge');

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

    const setPicture = (card: HTMLElement, extraOffset = 0): void => {
      card.style.backgroundImage = `url(/pictures/${gameState.levelImage})`;
      card.style.backgroundSize = `${WIDTH}px ${height}px`;
      card.style.backgroundPosition = `-${horizontalOffset + extraOffset}px -${verticalOffset}px`;
      card.classList.add('background');
    };

    if (word) {
      setPicture(word);
    }

    if (edge && word) {
      const wordRect = word.getBoundingClientRect();
      const edgeRect = edge.getBoundingClientRect();

      const EDGE_OVERLAP = 16;

      const edgeOffsetX = horizontalOffset + wordRect.width - edgeRect.width + EDGE_OVERLAP;
      const edgeOffsetY = verticalOffset + (wordRect.height - edgeRect.height) / 2;

      edge.style.backgroundImage = `url(/pictures/${gameState.levelImage})`;
      edge.style.backgroundSize = `${WIDTH}px ${height}px`;
      edge.style.backgroundPosition = `-${edgeOffsetX}px -${edgeOffsetY}px`;
      edge.classList.add('background');
    }
  });
}
