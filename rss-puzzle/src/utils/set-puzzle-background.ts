import type { PuzzleBackgroundOptions } from '../types/types';

export function setPuzzleBackground({
  wrapper,
  index,
  total,
  puzzle,
}: PuzzleBackgroundOptions): void {
  const PERCENTAGE = 100;
  const { imageSrc, rows, columns } = puzzle;

  wrapper.dataset.puzzleBackground = imageSrc;

  if (columns !== total) {
    return;
  }

  const col = index % columns;
  const row = Math.floor(index / columns);

  wrapper.style.backgroundImage = `url(/pictures/${imageSrc})`;
  wrapper.style.backgroundRepeat = 'no-repeat';

  wrapper.style.backgroundSize = `${columns * PERCENTAGE}% ${rows * PERCENTAGE}%`;

  wrapper.style.backgroundPosition = `
    ${-(col * PERCENTAGE)}% ${-(row * PERCENTAGE)}%
  `;
}
