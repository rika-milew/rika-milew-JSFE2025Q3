import { resetAllCarsPositions } from '@/components/car/car-animation/reset-car-position';
import { createFooter } from '@/components/footer/footer';
import { createHeader } from '@/components/header/header';
import { errorPopup } from '@/components/popup/error/error';
import { POPUP_MESSAGES } from '@/constants/error-messages';
import { appState } from '@/state/app-state';
import { createGarage } from '@/ui/garage/garage';
import { createWinners } from '@/ui/winners/winners';

export async function createApp(): Promise<void> {
  document.body.replaceChildren();
  createHeader();

  try {
    if (appState.view === 'garage') {
      await createGarage();
    } else {
      resetAllCarsPositions();
      createWinners();
    }
  } catch {
    if (appState.view === 'garage') {
      errorPopup.show(POPUP_MESSAGES.garageLoadFailed());
    } else {
      errorPopup.show(POPUP_MESSAGES.winnersLoadFailed());
    }
  }

  createFooter();
}
