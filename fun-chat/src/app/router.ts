import { renderAboutPage } from '@/pages/about/about-page';
import { renderAuthPage } from '@/pages/auth/auth-page';
import { renderMainPage } from '@/pages/main/main-page';
import { userStore } from '@/store/user-store';

export function router(route: string, container: HTMLElement): void {
  container.replaceChildren();

  if (route === 'main' && !userStore.isAuthenticated()) {
    history.replaceState(undefined, '', '#login');
    router('login', container);
    return;
  }
  if (route === 'login' && userStore.isAuthenticated()) {
    history.replaceState(undefined, '', '#main');
    router('main', container);
    return;
  }

  switch (route) {
    case 'login': {
      renderAuthPage(container);
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

export function navigate(route: string, container: HTMLElement): void {
  router(route, container);
  history.pushState(undefined, '', `#${route}`);
}
