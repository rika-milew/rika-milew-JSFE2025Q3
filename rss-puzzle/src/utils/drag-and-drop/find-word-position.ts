export function findWordPosition(container: HTMLElement, x: number): HTMLElement | undefined {
  const draggableWords = [...container.children].filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement &&
      child.classList.contains('word-wrapper') &&
      !child.classList.contains('dragging') &&
      !child.classList.contains('correct'),
  );

  for (const word of draggableWords) {
    const rect = word.getBoundingClientRect();
    if (x < rect.left + rect.width / 2) {
      return word;
    }
  }

  return undefined;
}
