export function setBackground(className: string): void {
  document.body.classList.remove('login-page', 'start-page', 'game-page');
  document.body.classList.add(className);
}
