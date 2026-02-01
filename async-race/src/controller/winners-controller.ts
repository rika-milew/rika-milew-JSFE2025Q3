import { createWinner, updateWinner } from '@/api/winners';
import { errorPopup } from '@/components/popup/error/error';
import { POPUP_MESSAGES } from '@/constants/error-messages';
import { handleWinnerUpdate } from '@/controller/helpers/handle-winner-update';
import { eventState } from '@/state/events/event-state';
import { winnersState } from '@/state/winners-state';

import type { WinnerAddPayload, Winner } from '@/types/types';

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

    const existingWinner: Winner | undefined = winnersState.getById(id);

    if (existingWinner) {
      const currentWins: number = existingWinner.wins + 1;
      const bestTime: number = Math.min(existingWinner.time, time);

      const updated: Winner | undefined = await updateWinner(id, currentWins, bestTime);

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
      const created: Winner | undefined = await createWinner(id, 1, time);

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

  eventState.on('car:delete', (payload: { id: number } | undefined) => {
    if (!payload) {
      return;
    }

    const carId: number = payload.id;

    if (winnersState.getById(carId)) {
      winnersState.remove(carId);
      eventState.emit('winner:updated');
    }
  });

  eventState.on('car:update', handleWinnerUpdate);
}
