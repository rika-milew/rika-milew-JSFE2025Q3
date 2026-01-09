import { createGarage } from './garage/garage';
import { createHeader } from './header/header';
import { createWinners } from './winners/winners';
import { appState } from '../state/app-state';
import { clearContainer } from '../utils/clear-container';

export async function createApp(): Promise<void> {
  clearContainer(document.body);
  createHeader();

  try {
    if (appState.view === 'garage') {
      await createGarage();
    } else {
      createWinners();
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error while creating the view:', error.message);
    } else {
      console.error('Unknown error while creating the view:', error);
    }
  }
}
