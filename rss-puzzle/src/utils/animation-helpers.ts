export function moveWords(word: HTMLElement, targetContainer: HTMLElement): void {
  const startPosition = word.getBoundingClientRect();
  targetContainer.append(word);
  const finalPosition = word.getBoundingClientRect();

  const deltaX = startPosition.left - finalPosition.left;
  const deltaY = startPosition.top - finalPosition.top;

  word.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

  word.getBoundingClientRect();

  word.style.transition = 'transform 0.4s ease';
  word.style.transform = 'translate(0, 0)';

  word.addEventListener(
    'transitionend',
    () => {
      word.style.transition = '';
      word.style.transform = '';
    },
    { once: true },
  );
}
