import { loadWinners } from '@ui/winners/helpers/load-winners';
import { winnersContainer, winnersList } from '@ui/winners/helpers/winners-list';
import { winnerInfoElements } from '@ui/winners/winners-info-elements';
import { createElement } from '@utils/create-element';

export async function createWinners(): Promise<void> {
  const main = createElement({ tag: 'div', className: ['main'] });
  const container = createElement({ tag: 'div', className: ['container'] });

  document.body.append(main);
  main.append(container);

  if (!container.contains(winnerInfoElements.container)) {
    container.append(winnerInfoElements.container);
  }

  if (!container.contains(winnersContainer)) {
    container.append(winnersContainer);
  }

  const tableContainer = createElement({ tag: 'div', className: ['table-container'] });
  container.append(tableContainer);

  await loadWinners();
  winnersList.renderWinners();
}
