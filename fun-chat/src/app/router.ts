import { renderAboutPage } from '@/pages/about/about-page';
import { renderAuthPage } from '@/pages/auth/auth-page';
import { renderMainPage } from '@/pages/main/main-page';

export function router(route: string, container: HTMLElement): void {
  container.innerHTML = '';

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

  history.pushState(undefined, '', `#${route}`);
}
