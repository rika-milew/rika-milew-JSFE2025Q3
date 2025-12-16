import { createLoginPage } from '../pages/login/LoginPage';

export function startApp(root: HTMLElement): void {
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  const mainContainer = document.createElement('div');
  mainContainer.className = 'container';
  root.appendChild(mainContainer);
  createLoginPage(mainContainer);
}
