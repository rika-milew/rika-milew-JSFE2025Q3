export function moveWordCards(wordWrapper: HTMLElement, targetContainer: HTMLElement): void {
  const startPosition = wordWrapper.getBoundingClientRect();
  targetContainer.append(wordWrapper);
  const finalPosition = wordWrapper.getBoundingClientRect();

  const deltaX = startPosition.left - finalPosition.left;
  const deltaY = startPosition.top - finalPosition.top;

  wordWrapper.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

  wordWrapper.getBoundingClientRect();

  wordWrapper.style.transition = 'transform 0.4s ease';
  wordWrapper.style.transform = 'translate(0, 0)';

  wordWrapper.addEventListener(
    'transitionend',
    () => {
      wordWrapper.style.transition = '';
      wordWrapper.style.transform = '';
    },
    { once: true },
  );
}
