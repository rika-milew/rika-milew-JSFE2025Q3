import { router } from '@/app/router';

export function startApp(root: HTMLElement): void {
  let route = location.hash.replace('#', '');

  if (!route) {
    route = 'login';
    history.replaceState(undefined, '', '#login');
  }

  router(route, root);

  globalThis.addEventListener('hashchange', () => {
    const route = location.hash.replace('#', '') || 'login';
    router(route, root);
  });
}
