import { getCars } from '../../data/garage/get-cars';
import { carState } from '../../state/car-state';

let isDefault = false;

export async function loadDefaultCars(): Promise<void> {
  if (isDefault) {
    return;
  }

  const { cars } = await getCars();
  carState.set(cars);

  isDefault = true;
}
