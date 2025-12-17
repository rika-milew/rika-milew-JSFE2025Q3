import { routes, Routes } from './AppRoutes';
import { clearContainer } from '../utils/clearContainer';

export type AppRouter = {
  navigate: (route: Routes) => void;
  logout: () => void;
};

const ANIMATION_TIME = 250;

export function createAppRouter(container: HTMLElement): AppRouter {
  const router = {
    navigate(route: Routes): void {
      const routeHandlers = routes(router);
      const showPage = routeHandlers[route];

      if (route !== Routes.LOGIN && !localStorage.getItem('user')) {
        router.navigate(Routes.LOGIN);
        return;
      }

      const current = container.firstElementChild;
      if (current) {
        current.classList.add('page_hidden');
      }

      setTimeout(() => {
        clearContainer(container);
        const page = showPage(container);
        page.classList.add('page', 'page_hidden');
        container.append(page);

        requestAnimationFrame(() => {
          page.classList.remove('page_hidden');
        });
      }, ANIMATION_TIME);
    },
    logout(): void {
      localStorage.removeItem('user');
      router.navigate(Routes.LOGIN);
    },
  };

  return router;
}
