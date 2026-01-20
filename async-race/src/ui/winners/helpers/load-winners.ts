import { getWinners } from '@api/winners/get-winners';
import { POPUP_MESSAGES } from '@data/error-messages';
import { carState } from '@state/car-state';
import { winnersState } from '@state/winners-state';
import { handleErrors } from '@utils/handle-errors';

let areWinnersLoaded = false;

export async function loadWinners(): Promise<void> {
  if (areWinnersLoaded) {
    return;
  }
  areWinnersLoaded = true;

  const result = await handleErrors(() => getWinners(), POPUP_MESSAGES.winnersLoadFailed());

  if (!result) {
    return;
  }

  const { winners } = result;

  const winnersData = winners.map((winner) => {
    const car = carState.getById(winner.id);

    return {
      id: winner.id,
      wins: winner.wins,
      time: winner.time,
      name: car?.name ?? 'Car',
      color: car?.color ?? '#000000',
    };
  });

  winnersState.set(winnersData);
  winnersState.totalWinners = winnersData.length;
}
