import { createLoginPage } from '../pages/login/LoginPage';
import { createStartPage } from '../pages/start/StartPage';

import type { AppRouter } from './AppRouter';

export enum Routes {
  LOGIN = 'login',
  START = 'start',
}

export const routes = (
  router: AppRouter,
): Record<Routes, (container: HTMLElement) => HTMLElement> => ({
  [Routes.LOGIN]: (container) => createLoginPage(container, router),
  [Routes.START]: (container) => createStartPage(container, router),
});
