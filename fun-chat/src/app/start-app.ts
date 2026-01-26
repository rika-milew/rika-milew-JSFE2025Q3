import { router } from '@/app/router';

export function startApp(root: HTMLElement): void {
  const route = location.hash.replace('#', '') || 'login';
  router(route, root);

  globalThis.addEventListener('hashchange', () => {
    const route = location.hash.replace('#', '') || 'login';
    router(route, root);
  });
}
