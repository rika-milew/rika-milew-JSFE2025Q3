import { createAppRouter } from './AppRouter';
import { Routes } from './routes';
import { createLoginPage } from '../pages/login/LoginPage';
import { createStartPage } from '../pages/start/StartPage';

import type { AppRouter } from './AppRouter';

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
