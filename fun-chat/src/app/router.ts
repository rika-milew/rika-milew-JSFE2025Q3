import { renderAboutPage } from '@/pages/about/about-page';
import { renderLoginPage } from '@/pages/login/login-page';
import { renderMainPage } from '@/pages/main/main-page';
import { userStore } from '@/store/user-store';

import type { Route } from '@/types/types';

const ROUTES: ReadonlySet<Route> = new Set<Route>(['login', 'main', 'about']);

function getRoute(): Route {
  const hash: string = location.hash.replace('#', '');

  if (isRoute(hash)) {
    return hash;
  }

  return 'login';
}

export function initRouter(container: HTMLElement): void {
  const hash = location.hash.replace('#', '');

  if (!isRoute(hash)) {
    history.replaceState({}, '', '#login');
    router('login', container);
    return;
  }

  const initialRoute: Route = getRoute();
  const resolvedRoute: Route = resolveRoute(initialRoute);

  history.replaceState({ route: resolvedRoute }, '', `#${resolvedRoute}`);

  router(resolvedRoute, container);

  globalThis.addEventListener('popstate', () => {
    const hash = location.hash.replace('#', '');

    if (!isRoute(hash)) {
      history.replaceState({}, '', '#login');
      router('login', container);
      return;
    }

    const finalRoute = resolveRoute(hash);
    router(finalRoute, container);
  });
}

export function router(route: Route, container: HTMLElement): void {
  container.replaceChildren();

  switch (route) {
    case 'login': {
      renderLoginPage(container);
      break;
    }
    case 'main': {
      renderMainPage(container);
      break;
    }
    case 'about': {
      renderAboutPage(container);
      break;
    }
    default: {
      container.textContent = 'Page not found';
    }
  }
}

export function resolveRoute(route: Route): Route {
  if (route === 'main' && !userStore.isLoggedIn()) {
    return 'login';
  }

  if (route === 'login' && userStore.isLoggedIn()) {
    return 'main';
  }

  return route;
}

export function navigate(route: Route, container: HTMLElement): void {
  const resolvedRoute: Route = resolveRoute(route);
  history.pushState({ route: resolvedRoute }, '', `#${resolvedRoute}`);
  router(resolvedRoute, container);
}

export function isRoute(value: string): value is Route {
  for (const route of ROUTES) {
    if (route === value) {
      return true;
    }
  }
  return false;
}
