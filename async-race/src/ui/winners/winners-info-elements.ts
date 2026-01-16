import { createInfoElements } from '@components/page-info/page-info';
import { appState } from '@state/app-state';

export const winnerInfoElements = createInfoElements({
  title: 'Winners',
  page: appState.winnersPage,
  total: appState.winners.length,
  totalText: 'Total Winners',
});

// eventState.on('winners:refresh', () => {
//   winnerInfoElements.totalInfo.textContent = `Total Winners: ${carState.totalCount}`;
// });

// eventState.on('winners:pagination:update', (data) => {
//   if (!data) {
//     return;
//   }

//   const { currentPage, totalCount } = data;
//   winnerInfoElements.totalInfo.textContent = `Total Winners: ${totalCount}`;
//   winnerInfoElements.pageInfo.textContent = `Page: ${currentPage} / ${Math.ceil(totalCount / appState.perPage) || 1}`;
// });
