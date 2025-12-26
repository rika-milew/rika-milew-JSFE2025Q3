import { createGamePage } from '../pages/game/game-page';
import { createLoginPage } from '../pages/login/login-page';
import { createStartPage } from '../pages/start/start-page';

import type { AppRouter } from './app-router';

export const Routes = {
  LOGIN: 'login',
  START: 'start',
  GAME: 'game',
} as const;

export type Routes = (typeof Routes)[keyof typeof Routes];

export const routes = (
  router: AppRouter,
): Record<Routes, (container: HTMLElement) => HTMLElement> => ({
  [Routes.LOGIN]: (container) => createLoginPage(container, router),
  [Routes.START]: (container) => createStartPage(container, router),
  [Routes.GAME]: (container) => createGamePage(container, router),
});
