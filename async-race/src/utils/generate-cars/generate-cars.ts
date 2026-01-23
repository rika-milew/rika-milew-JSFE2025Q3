import { createCar } from '@/api/garage/create-car';
import { errorPopup } from '@/components/popup/error/error';
import { POPUP_MESSAGES } from '@/data/error-messages';
import { generateCarName } from '@/utils/generate-cars/generate-car-name';
import { generateColor } from '@/utils/generate-cars/generate-color';

import type { Car } from '@/types/types';

const CAR_QUANTITY = 100;

export async function createRandomCars(quantity = CAR_QUANTITY): Promise<Car[]> {
  const requests: Promise<Car | undefined>[] = [];
  const carNames = new Set<string>();

  for (let index = 0; index < quantity; index++) {
    let name: string;
    do {
      name = generateCarName();
    } while (carNames.has(name));

    carNames.add(name);

    const color = generateColor();
    requests.push(createCar(name, color));
  }

  const newCars = await Promise.all(requests);

  if (newCars.includes(undefined)) {
    errorPopup.show(POPUP_MESSAGES.randomCarsFailed());
  }

  return newCars.filter((car): car is Car => !!car);
}
