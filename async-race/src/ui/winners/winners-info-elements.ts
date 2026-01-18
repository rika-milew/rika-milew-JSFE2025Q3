import { winnersState } from '@/state/winners-state';
import { createInfoElements } from '@components/page-info/page-info';
import { appState } from '@state/app-state';
import { eventState } from '@state/events/event-state';

export const winnerInfoElements = createInfoElements({
  title: 'Winners',
  page: appState.winnersPage,
  total: appState.winners.length,
  totalText: 'Total Winners',
});

eventState.on('winners:refresh', () => {
  winnerInfoElements.totalInfo.textContent = `Total Winners: ${winnersState.totalWinners}`;
});

eventState.on('winners:pagination:update', (data) => {
  if (!data) {
    return;
  }

  const { currentPage, totalCount } = data;
  winnerInfoElements.totalInfo.textContent = `Total Winners: ${totalCount}`;

  const totalPages = Math.ceil(totalCount / appState.winnersPerPage) || 1;
  const pageText = `Page: ${currentPage} / ${totalPages}`;
  winnerInfoElements.pageInfo.textContent = pageText;
});
