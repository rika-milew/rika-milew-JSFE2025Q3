import { createFooter } from './footer/footer';
import { createGarage } from './garage/garage';
import { createHeader } from './header/header';
import { createWinners } from './winners/winners';
import { errorPopup } from '../components/error/error';
import { appState } from '../state/app-state';

export async function createApp(): Promise<void> {
  document.body.replaceChildren();
  createHeader();

  try {
    if (appState.view === 'garage') {
      await createGarage();
    } else {
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
