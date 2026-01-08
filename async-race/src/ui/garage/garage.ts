import { createInfoElements } from '../../components/page-info/page-info';
import { appState } from '../../state/app-state';

import './garage.css';

export function createGarage(): void {
  document.body.append(
    createInfoElements({
      title: 'Garage',
      page: appState.garagePage,
      total: appState.garage.length,
      totalText: 'Total Cars',
    }),
  );
}
