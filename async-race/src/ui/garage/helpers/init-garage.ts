import { getCars } from '@/api/garage/get-cars';
import { POPUP_MESSAGES } from '@/data/error-messages';
import { carState } from '@/state/car-state';
import { handleErrors } from '@/utils/handle-errors';

let isDefault = false;

export async function loadDefaultCars(): Promise<void> {
  if (isDefault) {
    return;
  }

  const result = await handleErrors(() => getCars(), POPUP_MESSAGES.garageLoadFailed());

  if (!result) {
    return;
  }

  const { cars, totalCount } = result;
  carState.set(cars, totalCount);

  isDefault = true;
}
