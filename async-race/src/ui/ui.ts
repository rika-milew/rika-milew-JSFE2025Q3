import { createGarage } from './garage/garage';
import { createHeader } from './header/header';
import { createWinners } from './winners/winners';
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
