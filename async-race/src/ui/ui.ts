import { createGarage } from './garage';
import { createHeader } from './header';
import { createWinners } from './winners';
import { appState } from '../state/app-state';
import { clearContainer } from '../utils/clear-container';

export function createApp(): void {
  clearContainer(document.body);
  createHeader();

  if (appState.view === 'garage') {
    createGarage();
  } else {
    createWinners();
  }
}
