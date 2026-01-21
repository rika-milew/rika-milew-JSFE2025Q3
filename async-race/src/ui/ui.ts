import { resetAllCarsPositions } from '@/components/car/car-animation/reset-car-position';
import { POPUP_MESSAGES } from '@/data/error-messages';
import { appState } from '@/state/app-state';
import { createFooter } from '@/ui/footer/footer';
import { createGarage } from '@/ui/garage/garage';
import { createHeader } from '@/ui/header/header';
import { createWinners } from '@/ui/winners/winners';
import { handleErrorsVoid } from '@/utils/handle-errors';

export async function createApp(): Promise<void> {
  document.body.replaceChildren();
  createHeader();

  await handleErrorsVoid(
    async () => {
      if (appState.view === 'garage') {
        await createGarage();
      } else {
        resetAllCarsPositions();
        createWinners();
      }
    },

    appState.view === 'garage'
      ? POPUP_MESSAGES.garageLoadFailed()
      : POPUP_MESSAGES.winnersLoadFailed(),
  );

  createFooter();
}
