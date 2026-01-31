import { createWinner, updateWinner } from '@/api/winners';
import { errorPopup } from '@/components/popup/error/error';
import { POPUP_MESSAGES } from '@/constants/error-messages';
import { handleWinnerUpdate } from '@/controller/helpers/handle-winner-update';
import { eventState } from '@/state/events/event-state';
import { winnersState } from '@/state/winners-state';

import type { WinnerAddPayload } from '@/types/types';

let isWinnersControllerStarted = false;

export function startWinnersController(): void {
  if (isWinnersControllerStarted) {
    return;
  }
  isWinnersControllerStarted = true;

  eventState.on('winner:add', async (payload?: WinnerAddPayload) => {
    if (!payload) {
      return;
    }

    const { id, name, color, time } = payload;

    const existing = winnersState.getById(id);

    if (existing) {
      const currentWins = existing.wins + 1;
      const bestTime = Math.min(existing.time, time);

      const updated = await updateWinner(id, currentWins, bestTime);

      if (!updated) {
        errorPopup.show(POPUP_MESSAGES.winnerUpdateFailed(name));
        return;
      }

      winnersState.update({
        ...updated,
        name,
        color,
        wins: updated.wins,
      });
    } else {
      const created = await createWinner(id, 1, time);

      if (!created) {
        errorPopup.show(POPUP_MESSAGES.winnerCreateFailed(name));
        return;
      }

      winnersState.add({
        ...created,
        name,
        color,
      });
    }

    eventState.emit('winner:updated');
  });

  eventState.on('car:delete', (payload) => {
    if (!payload) {
      return;
    }

    const carId = payload.id;

    if (winnersState.getById(carId)) {
      winnersState.remove(carId);
      eventState.emit('winner:updated');
    }
  });

  eventState.on('car:update', handleWinnerUpdate);
}
