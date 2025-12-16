import { createLoginPage } from '../pages/login/LoginPage';

export function startApp(root: HTMLElement): void {
  while (root.firstChild) {
    root.firstChild.remove();
  }
  const mainContainer = document.createElement('div');
  mainContainer.className = 'container';
  root.append(mainContainer);
  createLoginPage(mainContainer);
}
