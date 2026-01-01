import { routes, Routes } from './routes';
import { hintState } from '../pages/game/hints/hint-state';
import { clearContainer } from '../utils/clear-container';

export type AppRouter = {
  navigate: (route: Routes) => void;
  logout: () => void;
};

const ANIMATION_TIME = 300;

export function createAppRouter(container: HTMLElement): AppRouter {
  const router = {
    navigate(route: Routes): void {
      const routeHandlers = routes(router);
      const showPage = routeHandlers[route];

      if (route !== Routes.LOGIN && !localStorage.getItem('user')) {
        router.navigate(Routes.LOGIN);
        return;
      }

      const currentPage = container.firstElementChild;

      if (currentPage instanceof HTMLElement) {
        currentPage.classList.add('page_hidden');
      }

      setTimeout(() => {
        clearContainer(container);

        const nextPage = showPage(container);
        nextPage.classList.add('page_hidden');
        container.append(nextPage);

        requestAnimationFrame(() => {
          nextPage.classList.remove('page_hidden');
        });
      }, ANIMATION_TIME);
    },
    logout(): void {
      localStorage.removeItem('user');
      hintState.reset();
      router.navigate(Routes.LOGIN);
    },
  };

  return router;
}
