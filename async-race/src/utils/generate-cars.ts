import { createCar } from '@/api/garage';
import { errorPopup } from '@/components/popup/error/error';
import { carBrands } from '@/constants/car-models';
import { POPUP_MESSAGES } from '@/constants/error-messages';

import type { Car, CarBrand } from '@/types/types';

const CAR_QUANTITY = 100;
const MAX_COLOR = 0xff_ff_ff;
const HEX_RADIX = 16;
const HEX_LENGTH = 6;

export async function createRandomCars(quantity = CAR_QUANTITY): Promise<Car[]> {
  const requests: Promise<Car | undefined>[] = [];
  const carNames: Set<string> = new Set<string>();

  for (let index = 0; index < quantity; index++) {
    let name: string;
    do {
      name = generateCarName();
    } while (carNames.has(name));

    carNames.add(name);

    const color: string = generateColor();
    requests.push(createCar(name, color));
  }

  const newCars: (Car | undefined)[] = await Promise.all(requests);

  if (newCars.includes(undefined)) {
    errorPopup.show(POPUP_MESSAGES.randomCarsFailed());
  }

  return newCars.filter((car): car is Car => !!car);
}

export function generateCarName(): string {
  const carBrand: CarBrand = carBrands[Math.floor(Math.random() * carBrands.length)];
  const model: string = carBrand.models[Math.floor(Math.random() * carBrand.models.length)];

  return `${carBrand.brand} ${model}`;
}

export function generateColor(): string {
  return `#${Math.floor(Math.random() * MAX_COLOR)
    .toString(HEX_RADIX)
    .padStart(HEX_LENGTH, '0')}`;
}
