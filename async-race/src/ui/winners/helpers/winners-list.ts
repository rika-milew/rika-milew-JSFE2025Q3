import { eventState } from '@state/events/event-state';
import { winnersState } from '@state/winners-state';
import { createWinnersTable } from '@ui/winners/table/winners-table';
import { createElement } from '@utils/create-element';

import type { WinnersList } from '@/types/types';

export const winnersContainer = createElement({ tag: 'div', className: ['garage-container'] });

export const winnersList: WinnersList = ((): WinnersList => {
  function renderWinners(): void {
    winnersContainer.replaceChildren();
    const winners = Object.values(winnersState.winners);
    if (winners.length === 0) {
      winnersContainer.append(createElement({ tag: 'p', textContent: 'No winners yet' }));
      return;
    }
    winnersContainer.append(createWinnersTable());
  }

  eventState.on('winner:add', renderWinners);
  eventState.on('winner:updated', renderWinners);
  eventState.on('winner:delete', renderWinners);

  renderWinners();

  return { renderWinners };
})();
