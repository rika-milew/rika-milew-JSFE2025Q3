import { createAppRouter } from './app-router';
import { Routes } from './routes';
import { createLoginPage } from '../pages/login/login-page';
import { createStartPage } from '../pages/start/start-page';

import type { AppRouter } from './app-router';

export function startApp(root: HTMLElement): void {
  while (root.firstChild) {
    root.firstChild.remove();
  }
  const mainContainer = document.createElement('div');
  mainContainer.className = 'container';
  root.append(mainContainer);

  const router: AppRouter = createAppRouter(mainContainer);

  const initialRoute = localStorage.getItem('user') ? Routes.START : Routes.LOGIN;

  if (initialRoute === Routes.START) {
    createStartPage(mainContainer, router);
  } else {
    createLoginPage(mainContainer, router);
  }

  router.navigate(initialRoute);
}
