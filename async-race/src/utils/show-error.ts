export function showError(
  errorText: HTMLParagraphElement,
  message: string,
  duration: number,
): void {
  errorText.textContent = message;
  errorText.classList.add('visible');

  setTimeout(() => {
    errorText.classList.remove('visible');
    errorText.textContent = '';
  }, duration);
}
