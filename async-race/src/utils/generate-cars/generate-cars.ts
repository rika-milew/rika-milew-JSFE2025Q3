import { createCar } from '@/api/garage/create-car';
import { generateCarName } from '@/utils/generate-cars/generate-car-name';
import { generateColor } from '@/utils/generate-cars/generate-color';

import type { Car } from '@/types/types';

const CAR_QUANTITY = 100;

export async function createRandomCars(quantity = CAR_QUANTITY): Promise<Car[]> {
  const requests: Promise<Car>[] = [];
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
  return newCars;
}
