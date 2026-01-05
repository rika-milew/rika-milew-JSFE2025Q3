export function updateResultPlaceholder(userSentence: HTMLElement, placeholder: HTMLElement): void {
  const words = [...userSentence.children].filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.classList.contains('word-wrapper'),
  );

  if (words.length > 0) {
    if (userSentence.contains(placeholder)) {
      placeholder.remove();
    }
  } else {
    if (!userSentence.contains(placeholder)) {
      userSentence.append(placeholder);
    }
  }
}
