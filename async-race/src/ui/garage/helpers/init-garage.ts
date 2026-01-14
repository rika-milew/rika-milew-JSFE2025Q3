import { POPUP_MESSAGES } from '@/data/error-messages';
import { handleErrors } from '@/utils/handle-errors';
import { getCars } from '@api/garage/get-cars';
import { appState } from '@state/app-state';
import { carState } from '@state/car-state';

let isDefault = false;

export async function loadDefaultCars(): Promise<void> {
  if (isDefault) {
    return;
  }

  const result = await handleErrors(
    () => getCars(appState.garagePage, appState.perPage),
    POPUP_MESSAGES.garageLoadFailed(),
  );

  if (!result) {
    return;
  }

  const { cars, totalCount } = result;
  carState.set(cars, totalCount);

  isDefault = true;
}
