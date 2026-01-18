import { appState } from '@state/app-state';
import { eventState } from '@state/events/event-state';
import { winnersState } from '@state/winners-state';
import { loadWinners } from '@ui/winners/helpers/load-winners';
import { winnersContainer, winnersList } from '@ui/winners/helpers/winners-list';
import { implementWinnersPagination } from '@ui/winners/helpers/winners-pagination';
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

  const { paginationContainer, previousButton, nextButton } = implementWinnersPagination({
    onPrev: () => {
      winnersList.setWinnersPage(appState.winnersPage - 1);
    },
    onNext: () => {
      winnersList.setWinnersPage(appState.winnersPage + 1);
    },
  });

  container.append(paginationContainer);

  if (!container.contains(winnersContainer)) {
    container.append(winnersContainer);
  }

  const tableContainer = createElement({ tag: 'div', className: ['table-container'] });
  container.append(tableContainer);

  await loadWinners();
  winnersList.renderWinners();

  eventState.on('winners:pagination:update', () => {
    const { winnersPage } = appState;
    const totalWinners = winnersState.totalWinners;

    const maxPage = Math.ceil(totalWinners / appState.winnersPerPage);

    previousButton.disabled = winnersPage === 1;
    nextButton.disabled = winnersPage === maxPage || maxPage === 0;
  });

  eventState.emit('winners:refresh');
}
