import { getCars } from '../../api/garage/get-cars';
import { appState } from '../../state/app-state';
import { carState } from '../../state/car-state';

let isDefault = false;

export async function loadDefaultCars(): Promise<void> {
  if (isDefault) {
    return;
  }

  const { cars, totalCount } = await getCars(appState.garagePage, appState.perPage);
  carState.set(cars, totalCount);

  isDefault = true;
}
