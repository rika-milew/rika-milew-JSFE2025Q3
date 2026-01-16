import { eventState } from '@state/events/event-state';
import { createWinnersTable } from '@ui/winners/table/winners-table';
import { winnerInfoElements } from '@ui/winners/winners-info-elements';
import { createElement } from '@utils/create-element';

export function createWinners(): void {
  const main = createElement({ tag: 'div', className: ['main'] });
  const container = createElement({ tag: 'div', className: ['container'] });

  document.body.append(main);
  main.append(container);

  if (!container.contains(winnerInfoElements.container)) {
    container.append(winnerInfoElements.container);
  }

  const tableContainer = createElement({ tag: 'div', className: ['table-container'] });
  container.append(tableContainer);

  createWinnersTable(tableContainer);

  eventState.on('winner:create', () => {
    createWinnersTable(tableContainer);
  });
}
