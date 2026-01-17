import { getWinners } from '@api/winners/get-winners';
import { errorPopup } from '@components/popup/error/error';
import { carState } from '@state/car-state';
import { winnersState } from '@state/winners-state';

let AreWinnersLoaded = false;

export async function loadWinners(): Promise<void> {
  if (AreWinnersLoaded) {
    return;
  }

  AreWinnersLoaded = true;

  try {
    const response = await getWinners();
    const winnersData = response.winners.map((winner) => {
      const car = carState.getById(winner.id);
      return {
        ...winner,
        name: car?.name ?? 'Car',
        color: car?.color ?? '#000000',
      };
    });

    winnersState.set(winnersData);
  } catch {
    errorPopup.show('Failed to load winners');
  }
}
