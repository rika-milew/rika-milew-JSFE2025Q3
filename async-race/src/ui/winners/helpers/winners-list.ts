import { appState } from '@state/app-state';
import { eventState } from '@state/events/event-state';
import { winnersState } from '@state/winners-state';
import { createWinnersTable } from '@ui/winners/table/winners-table';
import { createElement } from '@utils/create-element';

import type { WinnersList } from '@/types/types';

export const winnersContainer = createElement({ tag: 'div', className: ['garage-container'] });

export const winnersList: WinnersList = ((): WinnersList => {
  function renderWinners(): void {
    const start = (appState.winnersPage - 1) * appState.winnersPerPage;
    const end = start + appState.winnersPerPage;

    const winners = Object.values(winnersState.winners).slice(start, end);

    winnersContainer.replaceChildren();

    if (winners.length === 0) {
      winnersContainer.append(createElement({ tag: 'p', textContent: 'No winners yet' }));
      return;
    }
    winnersContainer.append(createWinnersTable(winners));

    eventState.emit('winners:pagination:update', {
      currentPage: appState.winnersPage,
      totalCount: winnersState.totalWinners,
    });
  }

  function setWinnersPage(page: number): void {
    const maxPage = Math.max(1, Math.ceil(winnersState.totalWinners / appState.winnersPerPage));

    if (page < 1 || page > maxPage) {
      return;
    }

    appState.winnersPage = page;
    renderWinners();

    eventState.emit('winners:pagination:update', {
      currentPage: appState.winnersPage,
      totalCount: winnersState.totalWinners,
    });
  }

  eventState.on('winners:refresh', () => {
    renderWinners();
  });

  eventState.on('winner:add', renderWinners);
  eventState.on('winner:updated', renderWinners);
  eventState.on('winner:delete', renderWinners);

  window.addEventListener('resize', () => {
    renderWinners();
  });

  renderWinners();

  return { renderWinners, setWinnersPage };
})();
