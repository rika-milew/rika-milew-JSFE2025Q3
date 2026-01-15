import { resetAllCars } from '@/components/car/car-animation/reset-car';
import { errorPopup } from '@components/error/error';
import { appState } from '@state/app-state';
import { createFooter } from '@ui/footer/footer';
import { createGarage } from '@ui/garage/garage';
import { createHeader } from '@ui/header/header';
import { createWinners } from '@ui/winners/winners';

export async function createApp(): Promise<void> {
  document.body.replaceChildren();
  createHeader();

  try {
    if (appState.view === 'garage') {
      await createGarage();
      resetAllCars();
    } else {
      resetAllCars();
      createWinners();
    }
  } catch {
    const message =
      appState.view === 'garage'
        ? 'Failed to load the garage view'
        : 'Failed to load the winners view';
    errorPopup.show(message);
  }

  createFooter();
}
