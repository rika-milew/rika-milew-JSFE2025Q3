import { createInfoElements } from '@components/page-info/page-info';
import { appState } from '@state/app-state';
import { createElement } from '@utils/create-element';

export function createWinners(): void {
  const container = createElement({ tag: 'div', className: ['container'] });

  document.body.append(container);

  const infoElements = createInfoElements({
    title: 'Winners',
    page: appState.winnersPage,
    total: appState.winners.length,
    totalText: 'Total Winners',
  });
  container.append(infoElements.container);
}
