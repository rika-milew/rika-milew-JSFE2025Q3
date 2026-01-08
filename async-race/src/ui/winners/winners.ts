import { createInfoElements } from '../../components/page-info/page-info';
import { appState } from '../../state/app-state';

export function createWinners(): void {
  document.body.append(
    createInfoElements({
      title: 'Winners',
      page: appState.winnersPage,
      total: appState.winners.length,
      totalText: 'Total Wins',
    }),
  );
}
