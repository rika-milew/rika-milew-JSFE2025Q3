import { createGamePage } from '../pages/game/game-page';
import { createLoginPage } from '../pages/login/login-page';
import { createStartPage } from '../pages/start/start-page';

import type { AppRouter } from './app-router';

export enum Routes {
  LOGIN = 'login',
  START = 'start',
  GAME = 'game',
}

export const routes = (
  router: AppRouter,
): Record<Routes, (container: HTMLElement) => HTMLElement> => ({
  [Routes.LOGIN]: (container) => createLoginPage(container, router),
  [Routes.START]: (container) => createStartPage(container, router),
  [Routes.GAME]: (container) => createGamePage(container, router),
});
