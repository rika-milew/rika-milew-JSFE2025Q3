import { getCars } from '@/api/garage';
import { errorPopup } from '@/components/popup/error/error';
import { POPUP_MESSAGES } from '@/constants/error-messages';
import { carState } from '@/state/car-state';

let isDefault = false;

export async function loadDefaultCars(): Promise<void> {
  if (isDefault) {
    return;
  }

  const result = await getCars();

  if (!result) {
    errorPopup.show(POPUP_MESSAGES.garageLoadFailed());
    return;
  }

  const { cars, totalCount } = result;

  carState.set(cars, totalCount);

  isDefault = true;
}
